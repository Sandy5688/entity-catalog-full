import express from 'express';
import dotenv from 'dotenv';
import entityRoutes from './routes/entity.routes.js';
import { register } from './metrics/metrics.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(entityRoutes);

app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default app;
