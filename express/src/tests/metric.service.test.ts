import { TypeEnum } from '../enums/type';
import Metric from '../models/metricModel'; 
import { getChartData } from '../services/metricService';

jest.mock('../models/metricModel');

describe('getChartData', () => {
    it('should return metrics with converted units', async () => {
        const mockMetrics = [
            {
                userId: 'userId',
                type: TypeEnum.DISTANCE,
                value: 100,
                unit: 'meter',
                date: new Date('2024-12-01T00:00:00Z'),
            },
            {
                userId: 'userId',
                type: TypeEnum.DISTANCE,
                value: 200,
                unit: 'meter',
                date: new Date('2024-12-02T00:00:00Z'),
            },
        ];

        (Metric.aggregate as jest.Mock).mockResolvedValue(mockMetrics);

        const data = await getChartData(TypeEnum.DISTANCE, 'userId', 1, 'centimeter');

        expect(data).toHaveLength(2);
        expect(data[0].value).toBe(10000);
        expect(data[1].value).toBe(20000); 
    });
});
