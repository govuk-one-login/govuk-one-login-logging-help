import { describe, it, expect } from "vitest";
import { OneLoginLogger } from "../src/formatter";
import type { UnformattedAttributes } from "@aws-lambda-powertools/logger/types";

describe("OneLoginLogger", () => {
  const formatter = new OneLoginLogger();

  const baseAttributes: UnformattedAttributes = {
    logLevel: "INFO",
    message: "test message",
    timestamp: new Date("2024-01-01T00:00:00.000Z"),
    lambdaContext: {
      coldStart: true,
      invokedFunctionArn: "arn:aws:lambda:eu-west-2:123456789:function:my-func",
      functionName: "my-func",
      awsRequestId: "req-123",
      memoryLimitInMB: 128,
    },
    serviceName: "test-service",
    environment: "",
    xRayTraceId: "",
    sampleRateValue: 0,
  };

  it("formats attributes into the standardised log shape", () => {
    const logItem = formatter.formatAttributes(baseAttributes, {});
    const output = logItem.getAttributes();

    expect(output).toMatchObject({
      cold_start: true,
      function_arn: "arn:aws:lambda:eu-west-2:123456789:function:my-func",
      function_name: "my-func",
      function_request_id: "req-123",
      level: "INFO",
      message: "test message",
    });
    expect(output.timestamp).toBeDefined();
  });

  it("includes additional log attributes", () => {
    const logItem = formatter.formatAttributes(baseAttributes, {
      sourceQueue: "arn:aws:sqs:eu-west-2:123456789:my-queue",
      count: 5,
    });
    const output = logItem.getAttributes();

    expect(output.sourceQueue).toBe("arn:aws:sqs:eu-west-2:123456789:my-queue");
    expect(output.count).toBe(5);
  });

  it("handles missing lambda context gracefully", () => {
    const attrs: UnformattedAttributes = {
      ...baseAttributes,
      lambdaContext: undefined as unknown as UnformattedAttributes["lambdaContext"],
    };
    const logItem = formatter.formatAttributes(attrs, {});
    const output = logItem.getAttributes();

    expect(output.cold_start).toBeUndefined();
    expect(output.function_arn).toBeUndefined();
    expect(output.function_name).toBeUndefined();
    expect(output.function_request_id).toBeUndefined();
  });
});
