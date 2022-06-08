import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Request, Response } from "express";

import { UserModuleConfiguration } from "../configuration";
import {
  AuthenticationResponse,
  AuthJwtStrategyRequest,
  GenericUserUpdateDto,
  SignInRequestDto,
  UsersResponse,
} from "../dto/users.dto";
import { MongoDbErrorFilter } from "../middleware/mongo-error.filter";
import { MongooseErrorFilter } from "../middleware/mongooose-error.filter";
import { User, UserSettings } from "../models/user.schema";
import { UserService } from "../services/user.service";

@Controller("users")
@UseGuards(AuthGuard("jwt"))
@UseFilters(MongooseErrorFilter, MongoDbErrorFilter)
export class UsersController {
  constructor(
    private config: UserModuleConfiguration,
    private readonly userService: UserService,
  ) {}

  @Post("signin")
  async signIn(
    @Body() body: SignInRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthenticationResponse> {
    const result = await this.userService.signIn(body);
    if (result !== null) {
      response.cookie(
        this.config.auth.refreshTokenCookies.name,
        result.cookie.refreshToken,
        {
          path: this.config.auth.refreshTokenCookies.path,
          expires: result.cookie.refreshTokenExpMS,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        },
      );
      return {
        message: "User signed in",
        ...result.body,
        id: result.body.id.toString(),
      };
    }
    throw new HttpException(
      "User could not be signed in",
      HttpStatus.FORBIDDEN,
    );
  }

  @Get("refresh")
  async refresh(@Req() request: Request): Promise<AuthenticationResponse> {
    const result = await this.userService.refresh(request.cookies);
    return { message: "User token was successfully refreshed", ...result };
  }

  @Delete("signout")
  @UseGuards(AuthGuard("jwt"))
  async signOut(
    @Req() request: AuthJwtStrategyRequest,
  ): Promise<AuthenticationResponse> {
    await this.userService.signOut(request.user.sub);
    return { message: "User signed out", id: request.user.sub };
  }

  @Get()
  async findAll(): Promise<UsersResponse> {
    const users = await this.userService.findAll();
    return { message: "Found users", users };
  }

  @Post()
  async createOne(@Body() body: User): Promise<UsersResponse> {
    const { id, user, token, expires } = await this.userService.createOne(body);

    return {
      message: "User saved",
      id,
      user,
      token,
      expires,
    };
  }

  @Get(":userId")
  async findOne(@Param("userId") id: string): Promise<UsersResponse> {
    const user = await this.userService.findOne(id);

    if (user === null) {
      throw new HttpException("User could not be found", HttpStatus.NOT_FOUND);
    }
    return { message: "Found user", user };
  }

  @Put(":userId")
  async updateOne(
    @Param("userId") id: string,
    @Body() body: GenericUserUpdateDto,
  ): Promise<UsersResponse> {
    const user = await this.userService.updateOne({ id }, body);

    if (user === null) {
      throw new HttpException(
        "User could not be updated",
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: "User updated", user };
  }

  @Delete(":userId")
  async deleteOne(@Param("userId") id: string): Promise<UsersResponse> {
    const user = await this.userService.deleteOne(id);

    if (user === null) {
      throw new HttpException(
        "User could not be deleted",
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: "User deleted" };
  }

  @Patch(":userId/settings")
  async updateSettings(
    @Param("userId") id: string,
    @Query("recalcStatistics") recalcStatistics: string,
    @Body() body: UserSettings,
  ): Promise<UsersResponse> {
    const settings = await this.userService.updateSettings(
      id,
      body,
      JSON.parse(recalcStatistics),
    );

    if (settings === null) {
      throw new HttpException(
        "User settings could not be updated",
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: "User settings updated", settings };
  }
}
