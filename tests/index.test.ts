import { describe, it, expect } from "vitest";
import { OneLoginLogger, logger, initialiseLogger } from "../src/index";

describe("index exports", () => {
  it("exports OneLoginLogger class", () => {
    expect(OneLoginLogger).toBeDefined();
  });

  it("exports logger instance", () => {
    expect(logger).toBeDefined();
  });

  it("exports initialiseLogger function", () => {
    expect(typeof initialiseLogger).toBe("function");
  });
});
