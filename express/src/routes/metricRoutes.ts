import { Router } from 'express';
import { addMetric, fetchMetrics, fetchChartData } from '../handlers/metricHandler';

const router: Router = Router();

router.post('/', addMetric);
router.get('/', fetchMetrics);
router.get('/chart', fetchChartData);

export default router;
