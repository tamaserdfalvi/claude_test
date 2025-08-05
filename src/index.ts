import App from './app';
import { Server } from 'http';

// Handle environment variables
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV: string = process.env.NODE_ENV || 'development';

// Initialize and start the application
const app = new App(PORT);
let server: Server;

// Graceful shutdown function
const gracefulShutdown = (signal: string): void => {
  console.log(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('Error during server shutdown:', err);
        process.exit(1);
      } else {
        console.log('Server closed successfully');
        process.exit(0);
      }
    });
  } else {
    process.exit(0);
  }
};

// Graceful shutdown handling
process.on('SIGTERM', (): void => gracefulShutdown('SIGTERM'));
process.on('SIGINT', (): void => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error): void => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown): void => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the server
server = app.listen();

export default app;