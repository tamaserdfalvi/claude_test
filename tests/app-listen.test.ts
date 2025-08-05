import App from '../src/app';
import { Server } from 'http';

describe('App Listen Method', () => {
  let consoleSpy: jest.SpyInstance;
  let originalNodeEnv: string | undefined;
  let mockServer: Server;

  beforeAll(() => {
    // Create a mock server that can be closed properly
    mockServer = {
      close: jest.fn((callback) => {
        if (callback) callback();
      }),
      listen: jest.fn()
    } as any;
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    originalNodeEnv = process.env.NODE_ENV;
    // Set NODE_ENV to development for tests unless specifically overridden
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  describe('listen() method', () => {
    it('should log startup messages with default environment', (done) => {
      const port = 3001;
      const app = new App(port);
      
      // Mock the Express app.listen method to call the callback immediately
      const mockListen = jest.fn().mockImplementation((port: number, callback: () => void) => {
        // Call the callback immediately to simulate server start
        callback();
        return mockServer;
      });
      
      app.getApp().listen = mockListen;

      // Call listen method
      const server = app.listen();

      // Verify console.log was called with expected messages
      expect(consoleSpy).toHaveBeenCalledWith(`🚀 Server running on port ${port}`);
      expect(consoleSpy).toHaveBeenCalledWith(`📱 Health check: http://localhost:${port}/api/health`);
      expect(consoleSpy).toHaveBeenCalledWith(`📖 API docs: http://localhost:${port}/api-docs`);
      expect(consoleSpy).toHaveBeenCalledWith(`🌍 Environment: development`);
      
      expect(mockListen).toHaveBeenCalledWith(port, expect.any(Function));
      expect(server).toBe(mockServer);
      
      done();
    });

    it('should log startup messages with custom port', (done) => {
      const port = 8080;
      const app = new App(port);
      
      // Mock the Express app.listen method
      const mockListen = jest.fn().mockImplementation((port: number, callback: () => void) => {
        callback();
        return mockServer;
      });
      
      app.getApp().listen = mockListen;

      const server = app.listen();

      expect(consoleSpy).toHaveBeenCalledWith(`🚀 Server running on port ${port}`);
      expect(consoleSpy).toHaveBeenCalledWith(`📱 Health check: http://localhost:${port}/api/health`);
      expect(consoleSpy).toHaveBeenCalledWith(`📖 API docs: http://localhost:${port}/api-docs`);
      expect(consoleSpy).toHaveBeenCalledWith(`🌍 Environment: development`);
      expect(server).toBe(mockServer);
      
      done();
    });

    it('should log startup messages with production environment', (done) => {
      process.env.NODE_ENV = 'production';
      const port = 5000;
      const app = new App(port);
      
      const mockListen = jest.fn().mockImplementation((port: number, callback: () => void) => {
        callback();
        return mockServer;
      });
      
      app.getApp().listen = mockListen;

      const server = app.listen();

      expect(consoleSpy).toHaveBeenCalledWith(`🚀 Server running on port ${port}`);
      expect(consoleSpy).toHaveBeenCalledWith(`📱 Health check: http://localhost:${port}/api/health`);
      expect(consoleSpy).toHaveBeenCalledWith(`📖 API docs: http://localhost:${port}/api-docs`);
      expect(consoleSpy).toHaveBeenCalledWith(`🌍 Environment: production`);
      expect(server).toBe(mockServer);
      
      done();
    });

    it('should log startup messages with test environment', (done) => {
      process.env.NODE_ENV = 'test';
      const port = 4000;
      const app = new App(port);
      
      const mockListen = jest.fn().mockImplementation((port: number, callback: () => void) => {
        callback();
        return mockServer;
      });
      
      app.getApp().listen = mockListen;

      const server = app.listen();

      expect(consoleSpy).toHaveBeenCalledWith(`🚀 Server running on port ${port}`);
      expect(consoleSpy).toHaveBeenCalledWith(`📱 Health check: http://localhost:${port}/api/health`);
      expect(consoleSpy).toHaveBeenCalledWith(`📖 API docs: http://localhost:${port}/api-docs`);
      expect(consoleSpy).toHaveBeenCalledWith(`🌍 Environment: test`);
      expect(server).toBe(mockServer);
      
      done();
    });

    it('should log startup messages when NODE_ENV is undefined', (done) => {
      delete process.env.NODE_ENV;
      const port = 6000;
      const app = new App(port);
      
      const mockListen = jest.fn().mockImplementation((port: number, callback: () => void) => {
        callback();
        return mockServer;
      });
      
      app.getApp().listen = mockListen;

      const server = app.listen();

      expect(consoleSpy).toHaveBeenCalledWith(`🚀 Server running on port ${port}`);
      expect(consoleSpy).toHaveBeenCalledWith(`📱 Health check: http://localhost:${port}/api/health`);
      expect(consoleSpy).toHaveBeenCalledWith(`📖 API docs: http://localhost:${port}/api-docs`);
      expect(consoleSpy).toHaveBeenCalledWith(`🌍 Environment: development`);
      expect(server).toBe(mockServer);
      
      done();
    });

    it('should handle port 0 (random port assignment)', (done) => {
      const port = 0;
      const app = new App(port);
      
      const mockListen = jest.fn().mockImplementation((port: number, callback: () => void) => {
        callback();
        return mockServer;
      });
      
      app.getApp().listen = mockListen;

      const server = app.listen();

      expect(consoleSpy).toHaveBeenCalledWith(`🚀 Server running on port ${port}`);
      expect(consoleSpy).toHaveBeenCalledWith(`📱 Health check: http://localhost:${port}/api/health`);
      expect(consoleSpy).toHaveBeenCalledWith(`📖 API docs: http://localhost:${port}/api-docs`);
      expect(consoleSpy).toHaveBeenCalledWith(`🌍 Environment: development`);
      expect(server).toBe(mockServer);
      
      done();
    });
  });

  describe('getApp() method', () => {
    it('should return the Express app instance', () => {
      const app = new App();
      const expressApp = app.getApp();
      
      expect(expressApp).toBeDefined();
      expect(typeof expressApp.use).toBe('function');
      expect(typeof expressApp.get).toBe('function');
      expect(typeof expressApp.listen).toBe('function');
    });
  });
});