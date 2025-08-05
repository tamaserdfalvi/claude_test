import express, { Application, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import healthRoutes from './routes/health';

class App {
  public app: Application;
  private readonly port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Parse JSON bodies
    this.app.use(express.json({ limit: '10mb' }));
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // Basic security headers
    this.app.use((req: Request, res: Response, next: NextFunction): void => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });

    // Request logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction): void => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Load OpenAPI specification
    try {
      const openApiPath = path.join(process.cwd(), 'openapi.yaml');
      const openApiFile = fs.readFileSync(openApiPath, 'utf8');
      const swaggerDocument = yaml.load(openApiFile) as object;

      // Serve Swagger UI
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'AI Dev Team API Documentation'
      }));

      console.log('📖 API Documentation available at /api-docs');
    } catch (error) {
      console.warn('⚠️  Could not load OpenAPI specification:', error);
    }

    // Mount health routes under /api
    this.app.use('/api', healthRoutes);

    // Root endpoint
    this.app.get('/', (req: Request, res: Response): void => {
      res.json({
        message: 'AI Dev Team API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        documentation: '/api-docs'
      });
    });

    // 404 handler for undefined routes
    this.app.use('*', (req: Request, res: Response): void => {
      res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
      console.error('Unhandled error:', err);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { details: err.message }),
      });
    });
  }

  public listen(): void {
    this.app.listen(this.port, (): void => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📱 Health check: http://localhost:${this.port}/api/health`);
      console.log(`📖 API docs: http://localhost:${this.port}/api-docs`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;