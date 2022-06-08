import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy, ExtractJwt } from "passport-jwt";

import { UserModuleConfiguration } from "../configuration";
import { AccessTokenDto } from "../dto/users.dto";
import { UserService } from "../services/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: UserModuleConfiguration,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.jwtSecret,
      jsonWebTokenOptions: {
        maxAge: config.auth.jwtExpS,
      },
    });
  }

  validate(jwtPayload: AccessTokenDto) {
    const user = jwtPayload;
    if (this.userService.validateAccessToken(jwtPayload.exp)) return user;
  }
}
