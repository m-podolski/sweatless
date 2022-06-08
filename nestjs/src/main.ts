import { NestFactory } from "@nestjs/core";
import { ConsoleLogger, LoggerService, RequestMethod } from "@nestjs/common";

import { AppMode, AppModuleConfiguration } from "./configuration";
import { AppModule } from "./app.module";
import { ProductionLogger } from "./production-logger.service";

const config = new AppModuleConfiguration();

let logger: LoggerService;
switch (config.env.mode) {
  case AppMode.DEV:
    logger = new ConsoleLogger();
    break;
  case AppMode.PROD:
    logger = new ProductionLogger(config);
    break;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  app.setGlobalPrefix("api", {
    exclude: [{ path: "ui", method: RequestMethod.GET }],
  });
  await app.listen(config.env.port !== undefined ? config.env.port : 3000);
}
bootstrap();
