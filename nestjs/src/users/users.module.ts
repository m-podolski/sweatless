import * as fs from "fs/promises";
import { constants } from "fs";

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";

import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";

import { ProductionLogger } from "src/production-logger.service";
import { AppModuleConfiguration } from "src/configuration";
import { UserModuleConfiguration } from "./configuration";
import { name as userSchemaName, userSchema } from "./models/user.schema";
import {
  name as refreshTokenSchemaName,
  refreshTokenSchema,
} from "./models/refresh-token.schema";
import { UsersController } from "./controllers/users.controller";
import { ContentController } from "./controllers/content.controller";
import { JwtStrategy } from "./middleware/jwt.strategy";
import { UserService } from "./services/user.service";
import { ContentService } from "./services/content.service";
import { LogStatisticsService } from "./services/log-statistics.service";
import { UploadError, UploadErrorType } from "./errors";

const config = new UserModuleConfiguration();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: userSchemaName, schema: userSchema },
      { name: refreshTokenSchemaName, schema: refreshTokenSchema },
    ]),
    JwtModule.register({
      secret: config.auth.jwtSecret,
      signOptions: { expiresIn: config.auth.jwtExpS },
    }),
    MulterModule.register({
      storage: diskStorage({
        async destination(request, file, cb) {
          const userDir = `${config.storage.directory}/${request.params.userId}/`;
          try {
            await fs.access(userDir, constants.W_OK | constants.R_OK);
          } catch (error) {
            try {
              await fs.mkdir(userDir, { recursive: true });
            } catch (error) {
              cb(error as Error, userDir);
            }
          }
          cb(null, userDir);
        },
        filename(request, file, cb) {
          const uniqueId = uuidv4();
          const extension = config.storage.allowedFormats[file.mimetype];
          cb(null, `${uniqueId}.${extension}`);
        },
      }),
      fileFilter(request, file, cb) {
        if (
          Object.keys(config.storage.allowedFormats).includes(file.mimetype)
        ) {
          cb(null, true);
        } else {
          cb(new UploadError(UploadErrorType.MIMETYPE, file.mimetype), false);
        }
      },
      limits: {
        files: config.storage.maxFiles,
        fileSize: config.storage.maxFileSizeMB * 1000000,
      },
    }),
  ],
  controllers: [UsersController, ContentController],
  providers: [
    AppModuleConfiguration,
    UserModuleConfiguration,
    ProductionLogger,
    UserService,
    JwtStrategy,
    ContentService,
    LogStatisticsService,
  ],
})
export class UsersModule {}
