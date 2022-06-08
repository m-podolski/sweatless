import { config as envConfig } from "dotenv";

envConfig();

export default {
  env: {
    mode: process.env.NODE_ENV,
    host: `${process.env.HOST}:${process.env.PORT}`,
    port: process.env.PORT,
    dbURL: process.env.DB_URL,
  },
  logging: {
    errors: "../../logs/errors.txt",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpS: 60 * 15,
    refreshTokenExpMS: 1000 * 60 * 60 * 24 * 7,
    refreshTokenCookies: {
      name: "refreshToken",
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/users",
      },
    },
  },
  storage: {
    directory: "storage",
    fieldName: "files",
    maxFiles: 10,
    maxFileSizeMB: 5,
    allowedFormats: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    },
  },
  app: {
    logs: {
      timelineScaleDays: 60,
    },
  },
};
