import { Injectable } from "@nestjs/common";

import { config as envConfig } from "dotenv";

envConfig();

export enum AppMode {
  DEV = "development",
  PROD = "production",
  TEST = "testing",
}

@Injectable()
export class AppModuleConfiguration {
  env = {
    mode: process.env.NODE_ENV,
    host: `${process.env.HOST}:${process.env.PORT}`,
    port: process.env.PORT,
    dbURL: process.env.DB_URL,
    packageDistDirectory: "backend/dist",
    clientDistDirectory: "frontend/build",
  };
  mongoose = { serverSelectionTimeoutMS: 5000 };
  logs = {
    // relative to backend root-directory
    dir: "logs",
  };
}
