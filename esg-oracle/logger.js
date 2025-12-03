const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "esg-oracle" },
  transports: [
    // Error logs
    new transports.File({ 
      filename: "logs/esg-error.log", 
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined logs
    new transports.File({ 
      filename: "logs/esg-combined.log",
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console logging for development
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message, timestamp, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
          msg += ` ${JSON.stringify(meta, null, 2)}`;
        }
        return msg;
      })
    )
  }));
}

module.exports = logger;
