import { Logger } from "@aws-lambda-powertools/logger";
import type { LogLevel } from "@aws-lambda-powertools/logger/types";
import type { Context } from "aws-lambda";
import { OneLoginLogger } from "./formatter";

export const logger = new Logger({
  logFormatter: new OneLoginLogger(),
  logLevel: (process.env.LOG_LEVEL as LogLevel) ?? "DEBUG",
});

const CONTEXTUAL_KEYS = ["sourceQueue", "sourceQueueName"] as const;

export function initialiseLogger(context: Context): void {
  CONTEXTUAL_KEYS.forEach((key) => logger.removeKeys([key]));
  logger.addContext(context);
}
