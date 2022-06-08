import { Request } from "express";

import { User, UserRole } from "../models/user.schema";

export interface GenericUserUpdateDto {
  [key: string]: unknown;
}

export interface UsersResponse {
  message: string;
  users?: User[];
  user?: User;
  id?: string;
  token?: string;
  expires?: number;
  settings?: any;
}

export interface TokenDto {
  sub: string;
  role: UserRole;
}

export interface AccessTokenDto extends TokenDto {
  iat: number;
  exp: number;
}

export interface AuthJwtStrategyRequest extends Request {
  user: AccessTokenDto;
}

export interface SignInRequestDto {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  message: string;
  id: string;
  token?: string;
  expires?: number;
}
