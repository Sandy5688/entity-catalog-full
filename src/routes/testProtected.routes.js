import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Dummy protected route for auth tests
router.get(
  '/some/protected/route',
  requireAuth,
  requireAdmin,
  (req, res) => {
    res.status(200).json({ ok: true });
  }
);

export default router;
