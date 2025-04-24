
import express from 'express';
import { createServer } from 'http';
import { config } from './config';
import { setupMiddleware } from './middleware';
import { setupRoutes } from './routes';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

async function startServer() {
  try {
    const app = express();
    
    // Setup middleware
    setupMiddleware(app);
    
    // Setup API routes
    setupRoutes(app);
    
    // Error handling middleware (must be after routes)
    app.use(errorHandler);
    
    // Create HTTP server
    const server = createServer(app);
    
    // Start server
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
    
    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION:', err);
      process.exit(1);
    });
    
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
