import request from 'supertest';
import App from '../src/app';
import { Server } from 'http';

describe('App', () => {
  let app: App;
  let server: any;
  let httpServer: Server | null = null;

  beforeAll(() => {
    app = new App(0); // Use port 0 for random available port
    server = app.getApp();
  });

  afterAll(async () => {
    // Clean up any server instances if they were created
    if (httpServer) {
      await new Promise<void>((resolve) => {
        (httpServer as Server).close(() => {
          resolve();
        });
      });
    }
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(server)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        message: 'AI Dev Team API',
        version: '1.0.0',
        timestamp: expect.any(String),
        documentation: '/api-docs'
      });

      // Validate timestamp format
      expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(server)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'healthy',
        timestamp: expect.any(String)
      });

      // Validate timestamp format
      expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    });

    it('should have correct content type', async () => {
      const response = await request(server)
        .get('/api/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /api-docs', () => {
    it('should serve Swagger UI', async () => {
      const response = await request(server)
        .get('/api-docs/')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/html/);
      expect(response.text).toContain('swagger-ui');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(server)
        .get('/nonexistent-route')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Route /nonexistent-route not found',
        timestamp: expect.any(String)
      });

      // Validate timestamp format
      expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    });

    it('should return 404 for undefined API routes', async () => {
      const response = await request(server)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Route /api/nonexistent not found',
        timestamp: expect.any(String)
      });
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(server)
        .get('/')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });

  describe('JSON Parsing', () => {
    it('should handle JSON requests properly', async () => {
      const testData = { test: 'data' };
      
      // Since we don't have a POST endpoint yet, we'll test with a malformed request
      const response = await request(server)
        .post('/api/health')
        .send(testData)
        .expect(404); // Should be 404 since POST /api/health doesn't exist

      expect(response.body.error).toContain('Route /api/health not found');
    });
  });

  describe('Error Handling in Main App', () => {
    it('should handle errors through global error handler', async () => {
      // Mock console.error to capture error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const response = await request(server)
        .get('/test-error')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
        timestamp: expect.any(String)
        // Details may or may not be included depending on NODE_ENV
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unhandled error:', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors in development mode', async () => {
      // Set development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      // Create new app instance for development testing
      const devApp = new App(0);
      const devServer = devApp.getApp();
      
      // Mock console.error to capture error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const response = await request(devServer)
        .get('/test-error')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
        timestamp: expect.any(String),
        details: 'Test error for coverage'
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unhandled error:', expect.any(Error));
      
      // Restore environment and mocks
      process.env.NODE_ENV = originalEnv;
      consoleErrorSpy.mockRestore();
    });
  });
});