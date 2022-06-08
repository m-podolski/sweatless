import { join } from "path";

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";

import mongoose from "mongoose";
import * as cookieParser from "cookie-parser";

import { AppMode, AppModuleConfiguration } from "./configuration";
import { UsersModule } from "./users/users.module";

const config = new AppModuleConfiguration();
export const pathToSweatless = __dirname.slice(
  0,
  __dirname.length - config.env.packageDistDirectory.length,
);

@Module({
  imports: [
    MongooseModule.forRoot(config.env.dbURL as string, {
      serverSelectionTimeoutMS: config.mongoose.serverSelectionTimeoutMS,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(pathToSweatless, config.env.clientDistDirectory),
      exclude: ["/api/*"],
    }),
    UsersModule,
  ],
  providers: [AppModuleConfiguration],
})
export class AppModule implements NestModule {
  constructor(private config: AppModuleConfiguration) {
    this.initMongoose();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }

  initMongoose() {
    switch (this.config.env.mode) {
      case AppMode.DEV:
        mongoose.set("debug", { shell: true });
        break;
      case AppMode.PROD:
        mongoose.set("autoIndex", false);
        break;
    }
  }
}
