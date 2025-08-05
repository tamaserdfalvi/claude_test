import App from './app';

// Handle environment variables
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV: string = process.env.NODE_ENV || 'development';

// Initialize and start the application
const app = new App(PORT);

// Graceful shutdown handling
process.on('SIGTERM', (): void => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', (): void => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

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
app.listen();

export default app;