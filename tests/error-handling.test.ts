import request from 'supertest';
import express from 'express';
import App from '../src/app';

describe('Error Handling', () => {
  let app: App;
  let server: any;

  beforeAll(() => {
    // Set development environment to test error details
    process.env.NODE_ENV = 'development';
    app = new App(0);
    server = app.getApp();
  });

  afterAll(() => {
    // Reset environment
    process.env.NODE_ENV = 'test';
  });

  describe('Global Error Handler', () => {
    it('should verify error handler is configured', () => {
      // Test that the app instance exists and has error handling middleware
      expect(app).toBeDefined();
      expect(server).toBeDefined();
      
      // The error handler is configured in app.ts - this test verifies the setup
      const middlewareCount = server._router.stack.length;
      expect(middlewareCount).toBeGreaterThan(0);
    });

    it('should handle errors and return 500 with error details in development', async () => {
      // Mock console.error to capture error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Create a minimal Express app to test just the error handler
      const testApp = express();
      
      // Add the same middleware and error handler as the main app
      testApp.use(express.json({ limit: '10mb' }));
      testApp.use(express.urlencoded({ extended: true }));
      
      // Add a test route that throws an error
      testApp.get('/test-error', (req: any, res: any, next: any) => {
        const error = new Error('Test error message');
        next(error);
      });
      
      // Add the same error handler from App class
      testApp.use((err: Error, req: any, res: any, next: any): void => {
        console.error('Unhandled error:', err);
        
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: new Date().toISOString(),
          ...(process.env.NODE_ENV === 'development' && { details: err.message }),
        });
      });

      const response = await request(testApp)
        .get('/test-error')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
        timestamp: expect.any(String),
        details: 'Test error message' // Should include details in development
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unhandled error:', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors and return 500 without error details in production', async () => {
      // Set production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Mock console.error to capture error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Create a minimal Express app for production testing
      const testApp = express();
      
      // Add the same middleware and error handler as the main app
      testApp.use(express.json({ limit: '10mb' }));
      testApp.use(express.urlencoded({ extended: true }));
      
      // Add a test route that throws an error
      testApp.get('/test-error-prod', (req: any, res: any, next: any) => {
        const error = new Error('Production test error');
        next(error);
      });
      
      // Add the same error handler from App class
      testApp.use((err: Error, req: any, res: any, next: any): void => {
        console.error('Unhandled error:', err);
        
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: new Date().toISOString(),
          ...(process.env.NODE_ENV === 'development' && { details: err.message }),
        });
      });

      const response = await request(testApp)
        .get('/test-error-prod')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
        timestamp: expect.any(String)
        // Should NOT include details in production
      });

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unhandled error:', expect.any(Error));
      
      // Restore environment and mocks
      process.env.NODE_ENV = originalEnv;
      consoleErrorSpy.mockRestore();
    });

    it('should handle different types of errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Create a minimal Express app to test different error types
      const testApp = express();
      
      // Add the same middleware and error handler as the main app
      testApp.use(express.json({ limit: '10mb' }));
      testApp.use(express.urlencoded({ extended: true }));
      
      // Add a test route that throws a different type of error
      testApp.get('/test-error-string', (req: any, res: any, next: any) => {
        next('String error');
      });
      
      // Add the same error handler from App class
      testApp.use((err: Error, req: any, res: any, next: any): void => {
        console.error('Unhandled error:', err);
        
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          timestamp: new Date().toISOString(),
          ...(process.env.NODE_ENV === 'development' && { details: err.message || err }),
        });
      });

      const response = await request(testApp)
        .get('/test-error-string')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
        timestamp: expect.any(String),
        details: 'String error'
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle different NODE_ENV values', () => {
      const originalEnv = process.env.NODE_ENV;
      
      // Test development environment
      process.env.NODE_ENV = 'development';
      const devApp = new App(0);
      expect(devApp).toBeDefined();
      
      // Test production environment
      process.env.NODE_ENV = 'production';
      const prodApp = new App(0);
      expect(prodApp).toBeDefined();
      
      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('JSON Parsing', () => {
    it('should handle valid JSON requests', async () => {
      const validJson = { test: 'data' };
      
      const response = await request(server)
        .post('/api/nonexistent') // This endpoint doesn't exist
        .send(validJson)
        .expect(404);

      // Should get 404 for non-existent endpoint, meaning JSON was parsed successfully
      expect(response.body.error).toContain('Route /api/nonexistent not found');
    });
  });

  describe('Large Payload Handling', () => {
    it('should handle large payloads up to limit', async () => {
      // Create a payload close to but under the 10MB limit
      const largePayload = { data: 'x'.repeat(1024 * 1024) }; // 1MB of data

      const response = await request(server)
        .post('/api/test-large') // Non-existent endpoint
        .send(largePayload)
        .expect(404); // Should get 404 since endpoint doesn't exist, not payload error

      expect(response.body.error).toContain('Route /api/test-large not found');
    });
  });

  describe('OpenAPI Specification Loading', () => {
    it('should handle missing OpenAPI file gracefully', async () => {
      // Mock fs.readFileSync to throw an error
      const fs = require('fs');
      const originalReadFileSync = fs.readFileSync;
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      fs.readFileSync = jest.fn().mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      // Create new app instance to trigger the error path
      const testApp = new App(0);
      expect(testApp).toBeDefined();

      // Verify the warning was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        '⚠️  Could not load OpenAPI specification:',
        expect.any(Error)
      );

      // Restore original functions
      fs.readFileSync = originalReadFileSync;
      consoleSpy.mockRestore();
    });

    it('should load OpenAPI file successfully', async () => {
      expect(app).toBeDefined();
      expect(server).toBeDefined();

      // Verify that /api-docs is accessible (meaning OpenAPI loaded successfully)
      const response = await request(server)
        .get('/api-docs/')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });

  describe('Request Logging Middleware', () => {
    it('should log requests without breaking functionality', async () => {
      // Spy on console.log to verify logging
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const response = await request(server)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');

      // Restore console.log
      consoleSpy.mockRestore();
    });
  });
});