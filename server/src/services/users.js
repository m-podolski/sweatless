import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import config from "../config/main.js";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { AuthenticationError } from "../config/errors.js";
import { Totals } from "./logStatistics.js";

export default function UserServices() {
  function makeAccessToken(payload) {
    const token = jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpS,
    });
    const expires = jwt.verify(token, config.auth.jwtSecret).exp;
    return { token, expires };
  }

  function makeRefreshToken(payload) {
    const token = uuidv4();
    const expires = new Date(Date.now() + config.auth.refreshTokenExpMS);
    RefreshToken.create({
      token,
      expires,
      ...payload,
    });
    return { token, expires };
  }

  function captionFiles(body, files) {
    if (files) {
      let sortedFiles = files.map((file, i) => {
        let fileData = {
          path: file.path,
          displayName: file.originalname,
        };
        if (body.captions) fileData.caption = body.captions[i];
        return fileData;
      });
      body.files = sortedFiles;
    }
    return body;
  }

  return {
    async signIn({ email, password }) {
      const user = await User.findOneAndUpdate(
        { email },
        { lastlogin: Date.now() },
      );

      let passwordMatches = false;
      if (user) passwordMatches = await user.isValidPassword(password);
      if (passwordMatches) {
        const { token: accessToken, expires: accessTokenExp } = makeAccessToken(
          {
            sub: user._id,
            role: user.role,
          },
        );
        const { token: refreshToken, expires: refreshTokenExpMS } =
          makeRefreshToken({
            sub: user._id,
            role: user.role,
          });

        return {
          body: {
            id: user._id,
            token: accessToken,
            expires: accessTokenExp,
          },
          cookie: { refreshToken, refreshTokenExpMS },
        };
      } else {
        throw new AuthenticationError("USER", ["email", "password"]);
      }
    },

    async refresh(cookies) {
      const existingToken = await RefreshToken.findOne({
        token: cookies[config.auth.refreshTokenCookies.name],
      }).lean();
      if (existingToken === null) {
        throw new AuthenticationError("INVALID", "Header Authorization");
      }
      const expired = existingToken.expires.getTime() < Date.now();
      if (expired === false) {
        const { token: accessToken, expires: accessTokenExp } = makeAccessToken(
          {
            sub: existingToken.sub,
            role: existingToken.role,
          },
        );

        return {
          id: existingToken.sub,
          token: accessToken,
          expires: accessTokenExp,
        };
      } else {
        throw new AuthenticationError("EXPIRED", "Header Authorization");
      }
    },

    async signOut(jwt_sub) {
      await RefreshToken.deleteMany({ sub: jwt_sub });
    },

    async createUser(payload) {
      const userCreated = await User.create(payload);

      const { token, expires } = makeAccessToken({
        sub: userCreated._id,
        role: userCreated.role,
      });

      return {
        id: userCreated._id,
        username: userCreated.username,
        token,
        expires,
      };
    },

    async readUser(id = null) {
      if (id) {
        const user = await User.findById(
          id,
          "_id username role settings logs statistics",
        ).lean();
        const totals = Totals(
          user.statistics.totals,
          user.settings.logs.fields,
        );
        return {
          ...user,
          statistics: {
            ...user.statistics,
            totals: totals.format(),
          },
        };
      } else {
        return await User.find().lean();
      }
    },

    async updateUser(id, payload) {
      let user = await User.findOne({ _id: id });
      Object.keys(payload).forEach((field) => {
        user[field] = payload[field];
      });
      await user.save();

      return user;
    },

    async deleteUser(id) {
      await User.findByIdAndDelete(id);
    },

    async updateSettings(id, settings) {
      const { settings: updated } = await User.findByIdAndUpdate(
        id,
        { settings },
        { new: true, runValidators: true },
      );

      return updated;
    },

    async createSubresource(user_id, field, body, files) {
      let user = await User.findOne({ _id: user_id });

      body = captionFiles(body, files);
      user[field].push(body);

      const userField = user[field];
      const subDoc = userField[userField.length - 1];
      await user.save();

      return subDoc;
    },

    async updateSubresource(user_id, field, subDoc_id, body, files) {
      let user = await User.findOne({ _id: user_id });
      let subDoc = user[field].id(subDoc_id);

      body = captionFiles(body, files);
      delete body.captions;

      Object.keys(body).forEach((field) => {
        subDoc[field] = body[field];
      });
      await user.save();

      return subDoc;
    },

    async deleteSubresource(user_id, field, subDoc_id) {
      await User.findByIdAndUpdate(user_id, {
        $pull: {
          [field]: { _id: subDoc_id },
        },
      });
    },
  };
}
