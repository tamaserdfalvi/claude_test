import { HealthResponse, ApiResponse } from '../src/types';

describe('Type Definitions', () => {
  describe('HealthResponse', () => {
    it('should accept valid health response object', () => {
      const healthResponse: HealthResponse = {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };

      expect(healthResponse.status).toBe('healthy');
      expect(typeof healthResponse.timestamp).toBe('string');
    });

    it('should have required properties', () => {
      const healthResponse: HealthResponse = {
        status: 'healthy',
        timestamp: '2025-08-05T15:18:31.000Z'
      };

      // TypeScript compilation ensures these properties exist
      expect(healthResponse).toHaveProperty('status');
      expect(healthResponse).toHaveProperty('timestamp');
    });
  });

  describe('ApiResponse', () => {
    it('should accept valid API response without data', () => {
      const apiResponse: ApiResponse = {
        success: true,
        timestamp: new Date().toISOString()
      };

      expect(apiResponse.success).toBe(true);
      expect(typeof apiResponse.timestamp).toBe('string');
    });

    it('should accept valid API response with data', () => {
      const testData = { id: 1, name: 'test' };
      const apiResponse: ApiResponse<typeof testData> = {
        success: true,
        data: testData,
        timestamp: new Date().toISOString()
      };

      expect(apiResponse.success).toBe(true);
      expect(apiResponse.data).toEqual(testData);
      expect(typeof apiResponse.timestamp).toBe('string');
    });

    it('should accept valid API response with error', () => {
      const apiResponse: ApiResponse = {
        success: false,
        error: 'Test error message',
        timestamp: new Date().toISOString()
      };

      expect(apiResponse.success).toBe(false);
      expect(apiResponse.error).toBe('Test error message');
      expect(typeof apiResponse.timestamp).toBe('string');
    });

    it('should accept generic data types', () => {
      // Test with string data
      const stringResponse: ApiResponse<string> = {
        success: true,
        data: 'test string',
        timestamp: new Date().toISOString()
      };

      // Test with number data
      const numberResponse: ApiResponse<number> = {
        success: true,
        data: 42,
        timestamp: new Date().toISOString()
      };

      // Test with array data
      const arrayResponse: ApiResponse<string[]> = {
        success: true,
        data: ['item1', 'item2'],
        timestamp: new Date().toISOString()
      };

      expect(stringResponse.data).toBe('test string');
      expect(numberResponse.data).toBe(42);
      expect(arrayResponse.data).toEqual(['item1', 'item2']);
    });

    it('should handle complex nested objects', () => {
      interface User {
        id: number;
        name: string;
        email: string;
        preferences: {
          theme: 'light' | 'dark';
          notifications: boolean;
        };
      }

      const userData: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          theme: 'dark',
          notifications: true
        }
      };

      const userResponse: ApiResponse<User> = {
        success: true,
        data: userData,
        timestamp: new Date().toISOString()
      };

      expect(userResponse.data?.name).toBe('John Doe');
      expect(userResponse.data?.preferences.theme).toBe('dark');
    });
  });
});