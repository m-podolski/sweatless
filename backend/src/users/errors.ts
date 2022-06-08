import { HttpException, HttpStatus } from "@nestjs/common";

export enum AuthenticationErrorType {
  ACCESS_EXP = "Access token expired",
  REFRESH_INVALID = "Invalid refresh token",
  REFRESH_EXP = "Refresh token expired",
}

export class AuthenticationError extends HttpException {
  constructor(type: AuthenticationErrorType) {
    super(type, HttpStatus.UNAUTHORIZED);
  }
}

export enum UploadErrorType {
  MIMETYPE = "File format is not allowed",
}

export class UploadError extends HttpException {
  constructor(type: UploadErrorType, mimetype: string) {
    super(`${type} (${mimetype})`, HttpStatus.BAD_REQUEST);
  }
}
