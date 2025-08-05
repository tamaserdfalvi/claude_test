// Global test setup
process.env.NODE_ENV = 'test';

// Increase timeout for integration tests
jest.setTimeout(10000);

// Mock console methods in tests if needed
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  // Suppress console output during tests unless explicitly needed
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});