import { Injectable, LoggerService } from "@nestjs/common";

import { Logger, createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

import { AppModuleConfiguration } from "./configuration";

@Injectable()
export class ProductionLogger implements LoggerService {
  private logger!: Logger;

  constructor(private config: AppModuleConfiguration) {
    this.logger = createLogger({
      level: "error",
      levels: {
        logLevel: 0, // avoids conflict with Logger.log
        error: 1,
        warn: 2,
        debug: 3,
        verbose: 4,
      },
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        printf(({ timestamp, level, message, ...meta }) => {
          return `\n${timestamp} [${level.toUpperCase()}]: ${message}\n${
            meta[0]
          }`;
        }),
      ),
      transports: [
        new transports.File({
          dirname: config.logs.dir,
          filename: "error.log",
          level: "error",
        }),
      ],
      exceptionHandlers: [
        new transports.File({
          dirname: config.logs.dir,
          filename: "exception.log",
        }),
      ],
      rejectionHandlers: [
        new transports.File({
          dirname: config.logs.dir,
          filename: "rejections.log",
        }),
      ],
    });
  }

  log(message: string, ...optionalParams: any[]) {
    return;
  }

  error(message: string, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    return;
  }

  debug(message: string, ...optionalParams: any[]) {
    return;
  }

  verbose(message: string, ...optionalParams: any[]) {
    return;
  }
}
