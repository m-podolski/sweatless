import { Injectable } from "@nestjs/common";

import { config as envConfig } from "dotenv";

if (process.env.NODE_ENV) {
  if (["development", "testing"].includes(process.env.NODE_ENV)) envConfig();
}

export enum AppMode {
  DEV = "development",
  PROD = "production",
  TEST = "testing",
}

@Injectable()
export class AppModuleConfiguration {
  env = {
    mode: process.env.NODE_ENV,
    host: "http://localhost:3001",
    port: 3001,
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
