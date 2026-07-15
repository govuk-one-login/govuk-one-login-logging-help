import { LogFormatter, LogItem } from "@aws-lambda-powertools/logger";
import type {
  LogAttributes,
  UnformattedAttributes,
} from "@aws-lambda-powertools/logger/types";

export class OneLoginLogger extends LogFormatter {
  formatAttributes(attributes: UnformattedAttributes, additionalLogAttributes: LogAttributes): LogItem {
    return new LogItem({
      attributes: {
        cold_start: attributes.lambdaContext?.coldStart,
        function_arn: attributes.lambdaContext?.invokedFunctionArn,
        function_name: attributes.lambdaContext?.functionName,
        function_request_id: attributes.lambdaContext?.awsRequestId,
        level: attributes.logLevel,
        message: attributes.message,
        timestamp: this.formatTimestamp(attributes.timestamp),
        ...additionalLogAttributes,
      },
    });
  }
}
