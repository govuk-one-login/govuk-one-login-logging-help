# @govuk-one-login/logging

Standardised logging helper for GOV.UK One Login Lambda functions. Provides a pre-configured [AWS Lambda Powertools](https://docs.powertools.aws.dev/lambda/typescript/latest/) logger with a custom formatter that produces a consistent JSON log shape across all services.

## Installation

This package is published to **GitHub Packages**, not the public npm registry. You need to configure your project to resolve the `@govuk-one-login` scope from GitHub Packages before installing.

### 1. Configure registry

Create an `.npmrc` file in the root of your consuming project:

```
@govuk-one-login:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Set up authentication

Generate a [GitHub Personal Access Token](https://github.com/settings/tokens) with the `read:packages` scope and export it in your shell:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

> **⚠️ Do not hardcode the token in `.npmrc`.** Always reference it via the environment variable. If using GitHub Actions, the built-in `GITHUB_TOKEN` secret has read access to packages automatically.

### 3. Install

```bash
npm install @govuk-one-login/logging @aws-lambda-powertools/logger
```

## Usage

```typescript
import { logger, initialiseLogger } from "@govuk-one-login/logging";
import type { Context, SQSEvent } from "aws-lambda";

export async function handler(event: SQSEvent, context: Context) {
  initialiseLogger(context);

  logger.info("Received events for processing", { count: event.Records.length });
  logger.error("Something failed", { errorCode: "E001" });
}
```

## Log Output

Every log entry produces the following JSON structure:

```json
{
  "cold_start": true,
  "function_arn": "arn:aws:lambda:eu-west-2:123456789:function:my-func",
  "function_name": "my-func",
  "function_request_id": "abc-123",
  "level": "INFO",
  "message": "Received events for processing",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "count": 3
}
```

Additional attributes passed as the second argument to any log call are appended to the output.

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `LOG_LEVEL` | `DEBUG` | Minimum log level (`DEBUG`, `INFO`, `WARN`, `ERROR`) |

## API

### `initialiseLogger(context: Context): void`

Call at the start of every Lambda handler. This:
1. Clears stale contextual keys (`sourceQueue`, `sourceQueueName`) from previous warm invocations
2. Adds Lambda context (function name, ARN, request ID, cold start)

### `logger`

Pre-configured `Logger` instance from AWS Lambda Powertools with the custom formatter applied.

### `OneLoginLogger`

The custom `LogFormatter` class, exported for advanced use cases where you need to create your own Logger instance.

## Development

```bash
npm install
npm run build
npm test
```
