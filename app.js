import express from 'express';
import dotenv from 'dotenv';

import entityRoutes from './src/routes/entity.routes.js';
import testProtectedRoutes from './src/routes/testProtected.routes.js';
import metricsRoutes from './src/routes/metrics.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use(entityRoutes);
app.use(metricsRoutes);

// Test-only routes
if (process.env.NODE_ENV === 'test') {
  app.use(testProtectedRoutes);
}

export default app;