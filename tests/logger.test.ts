import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, initialiseLogger } from "../src/logger";
import type { Context } from "aws-lambda";

const mockContext: Context = {
  functionName: "test-function",
  functionVersion: "$LATEST",
  invokedFunctionArn: "arn:aws:lambda:eu-west-2:123456789:function:test-function",
  memoryLimitInMB: "128",
  awsRequestId: "request-id-123",
  logGroupName: "/aws/lambda/test-function",
  logStreamName: "2024/01/01/[$LATEST]abc123",
  callbackWaitsForEmptyEventLoop: true,
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

describe("logger", () => {
  it("is a Logger instance", () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });
});

describe("initialiseLogger", () => {
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger.removeKeys(["sourceQueue", "sourceQueueName"]);
    spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it("adds lambda context to the logger", () => {
    initialiseLogger(mockContext);
    logger.info("test");

    const logOutput = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logOutput.function_name).toBe("test-function");
    expect(logOutput.function_request_id).toBe("request-id-123");
  });

  it("clears stale contextual keys between invocations", () => {
    logger.appendKeys({ sourceQueue: "old-queue", sourceQueueName: "old-name" });

    initialiseLogger(mockContext);
    logger.info("test");

    const logOutput = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logOutput.sourceQueue).toBeUndefined();
    expect(logOutput.sourceQueueName).toBeUndefined();
  });
});
