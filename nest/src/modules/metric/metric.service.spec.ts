import { Test, TestingModule } from '@nestjs/testing';
import { MetricService } from './metric.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetricEntity } from './metric.entity';
import { Repository } from 'typeorm';
import { TypeEnum } from '../../enums/type';

describe('MetricService', () => {
  let metricService: MetricService;
  let metricRepository: Repository<MetricEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricService,
        {
          provide: getRepositoryToken(MetricEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    metricService = module.get<MetricService>(MetricService);
    metricRepository = module.get<Repository<MetricEntity>>(
      getRepositoryToken(MetricEntity),
    );
  });

  it('should be defined', () => {
    expect(metricService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new metric', async () => {
      const createMetricDto = {
        userId: '1',
        type: TypeEnum.DISTANCE,
        value: 100,
        unit: 'km',
        date: new Date(),
      };

      const savedMetric = { ...createMetricDto, id: '1' };
      jest.spyOn(metricRepository, 'save').mockResolvedValue(savedMetric);

      const result = await metricService.create(createMetricDto);
      expect(result).toEqual(savedMetric);
      expect(metricRepository.save).toHaveBeenCalledWith(createMetricDto);
    });

    it('should throw an error if save fails', async () => {
      const createMetricDto = {
        userId: '1',
        type: TypeEnum.DISTANCE,
        value: 100,
        unit: 'km',
        date: new Date(),
      };

      jest.spyOn(metricRepository, 'save').mockRejectedValue(new Error('Save failed'));

      await expect(metricService.create(createMetricDto)).rejects.toThrow(
        'Save failed',
      );
    });
  });

  describe('getMetrics', () => {
    it('should return an array of metrics', async () => {
      const userId = '1';
      const type = TypeEnum.TEMPERATURE;
      const metrics = [
        { id: '1', userId, type, value: 30, unit: 'C', date: new Date() },
      ];

      jest.spyOn(metricRepository, 'find').mockResolvedValue(metrics);

      const result = await metricService.getMetrics(type, userId);
      expect(result).toEqual(metrics);
      expect(metricRepository.find).toHaveBeenCalledWith({
        where: { type, userId },
      });
    });

    it('should throw an error if find fails', async () => {
      const userId = '1';
      const type = TypeEnum.TEMPERATURE;

      jest.spyOn(metricRepository, 'find').mockRejectedValue(new Error('Find failed'));

      await expect(metricService.getMetrics(type, userId)).rejects.toThrow(
        'Find failed',
      );
    });
  });

  describe('getChartData', () => {
    it('should return chart data for the specified period', async () => {
      const userId = '1';
      const period = 1;
      const type = TypeEnum.DISTANCE;
      const unit = 'centimeter';
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - period);

      const mockQueryResult = [
        { id: '1', userId, type, value: 0.01, unit, date: new Date() },
      ];

      jest.spyOn(metricRepository, 'query').mockResolvedValue(mockQueryResult);

      const result = await metricService.getChartData(userId, period, type, unit);
      expect(result).toEqual(mockQueryResult);
      expect(metricRepository.query).toHaveBeenCalledWith(
        `
            SELECT DISTINCT ON (DATE(date)) *
            FROM metric
            WHERE user_id = $1 AND type = $2 AND date >= $3
            ORDER BY DATE(date), date DESC
        `,
        [userId, type, startDate.toISOString()],
      );
    });

    it('should throw an error if query fails', async () => {
      const userId = '1';
      const period = 1;
      const type = TypeEnum.DISTANCE;

      jest.spyOn(metricRepository, 'query').mockRejectedValue(new Error('Query failed'));

      await expect(
        metricService.getChartData(userId, period, type),
      ).rejects.toThrow('Query failed');
    });

    it('should handle no results returned from query', async () => {
      const userId = '1';
      const period = 1;
      const type = TypeEnum.DISTANCE;

      jest.spyOn(metricRepository, 'query').mockResolvedValue([]);

      const result = await metricService.getChartData(userId, period, type);
      expect(result).toEqual([]);
      expect(metricRepository.query).toHaveBeenCalled();
    });
  });
});
