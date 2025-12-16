import express from 'express';
import { mergeEntities } from '../controllers/entityMerge.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin entity merge
router.post(
  '/entity/merge',
  requireAuth,
  requireAdmin,
  mergeEntities
);

export default router;
