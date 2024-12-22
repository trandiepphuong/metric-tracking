import express, { type Application } from 'express';
import metricRoutes from './routes/metricRoutes';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/metrics', metricRoutes);

export default app;
