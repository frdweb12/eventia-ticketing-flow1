
import dotenv from 'dotenv';
import path from 'path';

// Load config file based on environment
dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`
  )
});

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    connection: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/eventia',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
