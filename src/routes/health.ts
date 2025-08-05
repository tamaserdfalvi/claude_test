import { Request, Response, Router } from 'express';
import { HealthResponse } from '../types';

const router = Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req: Request, res: Response<HealthResponse>): void => {
  const healthResponse: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(healthResponse);
});

export default router;