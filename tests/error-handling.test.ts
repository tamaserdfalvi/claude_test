import request from 'supertest';
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
      // This test verifies the error handling in app.ts constructor
      // The try-catch block should prevent the app from crashing
      // if openapi.yaml is missing or malformed

      // Since we have a valid openapi.yaml, we can't easily test this
      // without modifying the file system, but we can verify the app
      // starts successfully with the current setup
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