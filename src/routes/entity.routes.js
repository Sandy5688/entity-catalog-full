import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/entity/import/manual',
  requireAuth(['admin', 'system']),
  (req, res) => {
    res.status(201).json({ success: true });
  }
);

router.post(
  '/entity/suggest',
  requireAuth(['admin', 'system']),
  (req, res) => {
    res.status(201).json({ success: true });
  }
);

router.post(
  '/entity/:id/refresh-metadata',
  requireAuth(['admin', 'system']),
  (req, res) => {
    res.status(200).json({ success: true });
  }
);

export default router;
