import request from 'supertest';
import app from '../app'; 
import { TypeEnum } from '../enums/type';

jest.mock('../services/metricService'); 

describe('Metric Handler API', () => {
    describe('GET /metrics/chart', () => {
        it('should fetch chart data', async () => {
            const mockData = [
                {
                    _id: { day: '2024-12-01', userId: 'user1', type: 'distance' },
                    value: 100,
                    unit: 'meter',
                },
            ];

            const { getChartData } = require('../services/metricService');
            getChartData.mockResolvedValue(mockData);

            const response = await request(app)
                .get('/metrics/chart')
                .query({ type: 'distance', userId: 'user1', period: 1 })
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockData);
        });
    });

    describe('POST /metrics', () => {
        it('should create a new metric', async () => {
            const mockMetric = {
                userId: 'user1',
                type: TypeEnum.DISTANCE,
                value: 100,
                unit: 'meter',
                date: new Date(),
            };

            const { createMetric } = require('../services/metricService');
            createMetric.mockResolvedValue(mockMetric);

            const response = await request(app)
                .post('/metrics')
                .send(mockMetric)

            expect(response.status).toBe(201);
            expect(createMetric).toHaveBeenCalled()
        }); 
        
        it('should fail because validation', async () => {
            const mockMetric = {
                userId: 'user1',
                type: 'Wrong type enum',
                value: 100,
                unit: 'meter',
                date: new Date(),
            };

            const { createMetric } = require('../services/metricService');
            createMetric.mockResolvedValue(mockMetric);

            const response = await request(app)
                .post('/metrics')
                .send(mockMetric)

            expect(response.status).toBe(400);
        });
    });
});
