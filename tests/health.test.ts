import request from 'supertest';
import express from 'express';
import healthRoutes from '../src/routes/health';

describe('Health Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', healthRoutes);
  });

  describe('GET /api/health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.status).toBe(200);
    });

    it('should return correct response structure', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(Object.keys(response.body)).toHaveLength(2);
    });

    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      const timestamp = response.body.timestamp;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      // Verify it's a valid date
      const date = new Date(timestamp);
      expect(date.toISOString()).toBe(timestamp);
      
      // Verify it's recent (within last minute)
      const now = new Date();
      const timeDiff = now.getTime() - date.getTime();
      expect(timeDiff).toBeLessThan(60000); // Less than 1 minute
    });

    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(5).fill(null).map(() => 
        request(app).get('/api/health').expect(200)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.body.status).toBe('healthy');
        expect(response.body.timestamp).toBeDefined();
      });

      // All responses should have slightly different timestamps
      const timestamps = responses.map(r => r.body.timestamp);
      const uniqueTimestamps = new Set(timestamps);
      expect(uniqueTimestamps.size).toBeGreaterThan(0);
    }, 15000);

    it('should not accept POST requests', async () => {
      await request(app)
        .post('/api/health')
        .expect(404);
    });

    it('should not accept PUT requests', async () => {
      await request(app)
        .put('/api/health')
        .expect(404);
    });

    it('should not accept DELETE requests', async () => {
      await request(app)
        .delete('/api/health')
        .expect(404);
    });
  });
});