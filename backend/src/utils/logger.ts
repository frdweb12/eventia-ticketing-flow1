
import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

// Create logs directory if it doesn't exist
const logDir = path.dirname(config.logging.filePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'eventia-api' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, service, ...rest }) => {
          return `${timestamp} [${service}] ${level}: ${message} ${
            Object.keys(rest).length ? JSON.stringify(rest, null, 2) : ''
          }`;
        })
      ),
    }),
    
    // File transport for non-test environments
    ...(config.isTest
      ? []
      : [
          new winston.transports.File({
            filename: config.logging.filePath,
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
          }),
        ]),
  ],
  exitOnError: false,
});

// Create morgan stream function
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
