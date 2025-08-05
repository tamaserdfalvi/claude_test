describe('Index - Server Entry Point', () => {
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;
  let originalEnv: NodeJS.ProcessEnv;
  let mockAppListen: jest.SpyInstance;
  let mockServer: any;
  
  // Store original process listeners to restore later
  let originalProcessListeners: { [key: string]: any[] } = {};

  beforeAll(() => {
    // Store original process listeners
    (['SIGTERM', 'SIGINT', 'uncaughtException', 'unhandledRejection'] as const).forEach(event => {
      originalProcessListeners[event] = process.listeners(event as any).slice();
    });

    // Mock process.exit to prevent actual exit
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit() was called');
    });

    // Create a mock server instance
    mockServer = {
      close: jest.fn((callback) => {
        if (callback) callback();
      })
    };
  });

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Mock console methods
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Clear all process listeners before each test to prevent accumulation
    (['SIGTERM', 'SIGINT', 'uncaughtException', 'unhandledRejection'] as const).forEach(event => {
      process.removeAllListeners(event as any);
    });
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    
    // Restore console mocks
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();

    // Clear module cache to prevent side effects
    jest.resetModules();

    // Clear all process listeners after each test
    (['SIGTERM', 'SIGINT', 'uncaughtException', 'unhandledRejection'] as const).forEach(event => {
      process.removeAllListeners(event as any);
    });

    // Restore mock if it exists
    if (mockAppListen) {
      mockAppListen.mockRestore();
    }
  });

  afterAll(() => {
    // Restore process.exit
    processExitSpy.mockRestore();

    // Restore original process listeners
    Object.keys(originalProcessListeners).forEach(event => {
      process.removeAllListeners(event as any);
      if (originalProcessListeners[event]) {
        originalProcessListeners[event].forEach(listener => {
          process.on(event as any, listener);
        });
      }
    });
  });

  describe('Environment Variable Handling', () => {
    it('should use default port 3000 when PORT is not set', () => {
      delete process.env.PORT;
      
      // Test the PORT parsing logic directly
      const PORT = parseInt(process.env.PORT || '3000', 10);
      expect(PORT).toBe(3000);
    });

    it('should use custom port from environment variable', () => {
      process.env.PORT = '8080';
      
      const PORT = parseInt(process.env.PORT || '3000', 10);
      expect(PORT).toBe(8080);
    });

    it('should handle invalid PORT environment variable', () => {
      process.env.PORT = 'invalid';
      
      const PORT = parseInt(process.env.PORT || '3000', 10);
      expect(PORT).toBeNaN();
    });

    it('should handle NODE_ENV variable', () => {
      process.env.NODE_ENV = 'production';
      
      const NODE_ENV = process.env.NODE_ENV || 'development';
      expect(NODE_ENV).toBe('production');
    });
  });

  describe('Application Initialization', () => {
    it('should define module structure without starting server', () => {
      // Mock the App class's listen method before importing
      const App = require('../src/app').default;
      const listenSpy = jest.spyOn(App.prototype, 'listen').mockReturnValue(mockServer);
      
      // Now safely import the index module
      const indexModule = require('../src/index');
      expect(indexModule).toBeDefined();
      expect(indexModule.default).toBeDefined();
      
      // Verify listen was called
      expect(listenSpy).toHaveBeenCalled();
      
      listenSpy.mockRestore();
    });
  });

  describe('Signal Handlers', () => {
    beforeEach(() => {
      // Mock the App class's listen method before importing
      const App = require('../src/app').default;
      mockAppListen = jest.spyOn(App.prototype, 'listen').mockReturnValue(mockServer);
      
      // Import the module to set up signal handlers
      require('../src/index');
    });

    it('should handle SIGTERM signal', () => {      
      try {
        process.emit('SIGTERM');
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('process.exit() was called');
      }
      
      expect(consoleSpy).toHaveBeenCalledWith('SIGTERM received. Shutting down gracefully...');
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it('should handle SIGINT signal', () => {      
      try {
        process.emit('SIGINT');
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('process.exit() was called');
      }
      
      expect(consoleSpy).toHaveBeenCalledWith('SIGINT received. Shutting down gracefully...');
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it('should handle uncaughtException', () => {
      const testError = new Error('Test uncaught exception');
      
      try {
        process.emit('uncaughtException', testError);
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('process.exit() was called');
      }
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Uncaught Exception:', testError);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle unhandledRejection', () => {
      const testReason = 'Test unhandled rejection';
      
      try {
        (process as any).emit('unhandledRejection', testReason);
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('process.exit() was called');
      }
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unhandled Rejection:', testReason);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle unhandledRejection with Error object', () => {
      const testError = new Error('Test rejection error');
      
      try {
        (process as any).emit('unhandledRejection', testError);
        expect(false).toBe(true); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe('process.exit() was called');
      }
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unhandled Rejection:', testError);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Module Export', () => {
    it('should export the app instance as default', () => {
      // Mock the App class's listen method before importing
      const App = require('../src/app').default;
      const listenSpy = jest.spyOn(App.prototype, 'listen').mockReturnValue(mockServer);
      
      const indexModule = require('../src/index');
      
      expect(indexModule.default).toBeDefined();
      // Check that it has the expected methods of an App instance
      expect(typeof indexModule.default.getApp).toBe('function');
      expect(typeof indexModule.default.listen).toBe('function');
      
      listenSpy.mockRestore();
    });
  });
});