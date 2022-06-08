import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { UserModuleConfiguration } from "../configuration";
import { SignInRequestDto, TokenDto } from "../dto/users.dto";
import { AuthenticationError, AuthenticationErrorType } from "../errors";
import {
  name as refreshTokenSchemaName,
  RefreshToken,
} from "../models/refresh-token.schema";
import {
  name as userSchemaName,
  User,
  UserRole,
  UserSettings,
} from "../models/user.schema";
import { LogStatisticsService } from "./log-statistics.service";

@Injectable()
export class UserService {
  constructor(
    private config: UserModuleConfiguration,
    @InjectModel(userSchemaName) private userModel: Model<User>,
    @InjectModel(refreshTokenSchemaName)
    private refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private logStatsService: LogStatisticsService,
  ) {}

  private makeAccessToken(payload: TokenDto) {
    const token = this.jwtService.sign(payload, {
      expiresIn: this.config.auth.jwtExpS,
    });
    const expiresIn = this.jwtService.verify(token);
    const expires = typeof expiresIn !== "string" ? expiresIn.exp : "";
    return { token, expires };
  }

  validateAccessToken(jwtExp: number) {
    const expDate = new Date(jwtExp * 1000);
    if (expDate < new Date()) {
      throw (
        (new AuthenticationError(AuthenticationErrorType.ACCESS_EXP), false)
      );
    }
    return true;
  }

  private makeRefreshToken(payload: TokenDto) {
    const token = uuidv4();
    const expires = new Date(
      Date.now() +
        (this.config.auth.refreshTokenExpMS || 1000 * 60 * 60 * 24 * 7),
    );
    this.refreshTokenModel.create({
      token,
      expires,
      ...payload,
    });
    return { token, expires };
  }

  async signIn({ email, password }: SignInRequestDto) {
    const user: User | null = await this.updateOne(
      { email },
      { lastLogin: Date.now() },
    );

    let passwordMatches = false;
    if (user !== null) {
      passwordMatches = await user.isValidPassword(password);

      if (passwordMatches) {
        const { token: accessToken, expires: accessTokenExp } =
          this.makeAccessToken({
            sub: user._id.toString(),
            role: user.role,
          });
        const { token: refreshToken, expires: refreshTokenExpMS } =
          this.makeRefreshToken({
            sub: user._id.toString(),
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
      }
    }
    return null;
  }

  async refresh(cookies: { [key: string]: string }) {
    const existingToken = await this.refreshTokenModel
      .findOne({
        token:
          cookies[this.config.auth.refreshTokenCookies.name || "refreshToken"],
      })
      .lean();
    if (existingToken === null) {
      throw new AuthenticationError(AuthenticationErrorType.REFRESH_INVALID);
    }

    const expired = existingToken.expires.getTime() < Date.now();
    if (expired === false) {
      const { token: accessToken, expires: accessTokenExp } =
        this.makeAccessToken({
          sub: existingToken.sub,
          role: existingToken.role as UserRole,
        });

      return {
        id: existingToken.sub,
        token: accessToken,
        expires: accessTokenExp,
      };
    } else {
      throw new AuthenticationError(AuthenticationErrorType.REFRESH_EXP);
    }
  }

  async signOut(sub: string) {
    const { deletedCount } = await this.refreshTokenModel.deleteMany({ sub });
    return deletedCount;
  }

  async findAll() {
    return (await this.userModel.find().lean()) as User[];
  }

  async createOne(payload: User) {
    const user = await this.userModel.create(payload);
    const { token, expires } = this.makeAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });

    return {
      id: user._id.toString(),
      user,
      token,
      expires,
    };
  }

  async findOne(id: string) {
    return (await this.userModel.findById(id).lean()) as User;
  }

  async updateOne(
    query: { [key: string]: string },
    payload: { [key: string]: unknown },
  ) {
    return await this.userModel.findOneAndUpdate(query, payload);
  }

  async deleteOne(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  async updateSettings(
    id: string,
    body: UserSettings,
    recalcStatistics: boolean,
  ) {
    const user = await this.userModel.findById(id);

    if (user !== null) {
      user.settings = body;
      let newStatistics;
      if (recalcStatistics) {
        newStatistics = this.logStatsService.recalculate(user);
        user.statistics = {
          totals: newStatistics.totals,
          proportions: newStatistics.proportions,
          timeline: newStatistics.timeline,
          months: newStatistics.months,
        };
      }

      await user.save();
      return user;
    }
    return null;
  }
}
