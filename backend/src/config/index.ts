
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Configuration constants
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const IS_TEST = NODE_ENV === 'test';

export const config = {
  // Server config
  nodeEnv: NODE_ENV,
  isProduction: IS_PRODUCTION,
  isTest: IS_TEST,
  port: parseInt(process.env.PORT || '4000', 10),
  
  // Database config
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'eventia',
    ssl: IS_PRODUCTION,
    max: parseInt(process.env.DB_POOL_MAX || '10', 10), // connection pool max
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
  },
  
  // JWT config
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'development_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: eval(process.env.RATE_LIMIT_WINDOW_MS || '15 * 60 * 1000'), // Default: 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // Default: 100 requests per windowMs
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Default to development frontend
    credentials: true,
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || path.join(process.cwd(), 'logs', 'app.log'),
  },
  
  // Static files config
  static: {
    maxAge: IS_PRODUCTION ? '7d' : '0',
  },
};

export default config;
