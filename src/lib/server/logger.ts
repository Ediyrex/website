import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: [
      "password",
      "passwordHash",
      "token",
      "tokenHash",
      "authorization",
      "cookie",
      "DATABASE_URL",
      "SESSION_SECRET",
      "req.headers.cookie",
      "req.headers.authorization",
    ],
    censor: "[REDACTED]",
  },
  base: {
    service: "ediyrex-api",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

