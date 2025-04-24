
import { Application } from 'express';
import { setupSwagger } from '../docs/swagger';
import authRoutes from './auth';
import eventRoutes from './events';
import bookingRoutes from './bookings';
import paymentRoutes from './payments';
import userRoutes from './users';
import { ApiError } from '../utils/apiError';

export function setupRoutes(app: Application): void {
  // API version prefix
  const apiPrefix = '/api/v1';
  
  // Register API routes
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/events`, eventRoutes);
  app.use(`${apiPrefix}/bookings`, bookingRoutes);
  app.use(`${apiPrefix}/payments`, paymentRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Setup Swagger documentation
  setupSwagger(app);
  
  // Handle 404 routes
  app.use('*', (req, res, next) => {
    next(ApiError.notFound(`Cannot find ${req.originalUrl} on this server`));
  });
}
