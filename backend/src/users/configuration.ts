import { Injectable } from "@nestjs/common";
import { config as envConfig } from "dotenv";

envConfig();

export interface LogInputConfig {
  [key: string]: {
    unit?: string;
    pattern: null | RegExp;
    errorMsg: null | string;
    footnote?: string;
  };
}

@Injectable()
export class UserModuleConfiguration {
  auth = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpS: 60 * 15,
    refreshTokenExpMS: 1000 * 60 * 60 * 24 * 7,
    refreshTokenCookies: {
      name: "refreshToken",
      path: "/api",
    },
  };
  storage: {
    directory: string;
    fieldName: string;
    maxFiles: number;
    maxFileSizeMB: number;
    allowedFormats: { [key: string]: string };
  } = {
    directory: "upload",
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
  };

  _logInputTypes: LogInputConfig = {
    DATE: {
      pattern: null,
      errorMsg: null,
    },
    DURATION: {
      unit: "hours",
      pattern: /[\d: \.,]{1,7}/,
      errorMsg:
        "Allowed characters: digits, space, comma, period and colon, max. length is 7 characters",
      footnote:
        "Duration can be entered in these formats: **H:MM** or **H.HH** or **H,HH** or **MMM**.",
    },
    LONG_TEXT: {
      pattern: /.{0,250}/,
      errorMsg: "Max. length is 250 characters",
    },
    SELECT: {
      pattern: null,
      errorMsg: null,
    },
    NUMBER: {
      pattern: /[\d: \.,]{1,6}/,
      errorMsg:
        "Allowed characters: digits, period and comma, max. length is 6 characters",
    },
    TEXT: {
      pattern: /.{1,100}/,
      errorMsg: "Max. length is 100 characters",
    },
  };

  getlogInputType(type: keyof UserModuleConfiguration["_logInputTypes"]) {
    return this._logInputTypes[type];
  }
}
