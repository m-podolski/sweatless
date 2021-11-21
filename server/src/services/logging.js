import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";
import config from "../config/main.js";
// eslint-disable-next-line
import chalk from "chalk";
import morgan from "morgan";

export function ErrorLogs() {
  const stream = createWriteStream(
    join(dirname(fileURLToPath(import.meta.url)), config.logging.errors),
    { flags: "a" },
  );

  return {
    write(error, reason, promise) {
      try {
        stream.write(
          `${new Date().toISOString()} ${reason ? reason : ""} ${
            promise ? promise : ""
          } \n${error?.stack ? error.stack + "\n" : ""} \n`,
        );
        console.error(error || reason);
      } catch (loggingError) {
        console.error(loggingError);
      }
    },
  };
}

export function logPretty(...messages) {
  for (const message of messages) {
    console.log(`${chalk.bold.yellow("Sweatless:")} ${message}`);
  }
}

export function logPrettyError(...messages) {
  for (const message of messages) {
    console.error(`${chalk.bold.red("Sweatless:")} ${message}`);
  }
}

export function initMorgan(app) {
  morgan.token("prefix", () => {
    return chalk.bold.black("Morgan:");
  });

  morgan.token("status", (req, res) => {
    const status = (
      typeof res.headersSent !== "boolean"
        ? Boolean(res._header)
        : res.headersSent
    )
      ? res.statusCode
      : undefined;
    const color =
      status >= 500
        ? 31 // red
        : status >= 400
        ? 33 // yellow
        : status >= 300
        ? 36 // cyan
        : status >= 200
        ? 32 // green
        : 0; // no color
    return `\x1b[${color}m${status}\x1b[0m`;
  });

  app.use(
    morgan(
      ":prefix :method :status :url :response-time ms - :res[content-length]",
    ),
  );
}
