import { Test, type TestingModule } from '@nestjs/testing';
import { MetricModule } from './metric.module';
import * as request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import { TypeEnum } from '../../enums/type';
import { MetricService } from './metric.service';
import { mock } from 'jest-mock-extended';

describe('MetricController (e2e)', () => {
  let app: INestApplication;
  let metricService: MetricService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MetricModule],
    })
      .overrideProvider(MetricService)
      .useValue(mock<MetricService>()) // Mock MetricService for controller tests
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    metricService = moduleFixture.get<MetricService>(MetricService);
  });

  it('/POST metrics (createMetric)', async () => {
    const createMetricDto = {
      userId: '1',
      type: TypeEnum.DISTANCE,
      value: 100,
      unit: 'km',
      date: new Date(),
    };

    const result = { ...createMetricDto, id: '1' };
    jest.spyOn(metricService, 'create').mockResolvedValue(result);

    return request(app.getHttpServer())
      .post('/metrics')
      .send(createMetricDto)
      .expect(201)
      .expect(result);
  });

  it('/GET metrics (getMetricsByType)', async () => {
    const userId = '1';
    const type = TypeEnum.TEMPERATURE;
    const metrics = [
      { id: '1', userId, type, value: 30, unit: 'C', date: new Date() },
    ];

    jest.spyOn(metricService, 'getMetrics').mockResolvedValue(metrics);

    return request(app.getHttpServer())
      .get('/metrics')
      .query({ userId, type })
      .expect(200)
      .expect(metrics);
  });

  it('/GET chart data (getChartData)', async () => {
    const userId = '1';
    const period = 1;
    const type = TypeEnum.DISTANCE;
    const unit = 'km';
    const chartData = [
      { id: '1', userId, type, value: 100, unit, date: new Date() },
    ];

    jest.spyOn(metricService, 'getChartData').mockResolvedValue(chartData);

    return request(app.getHttpServer())
      .get('/metrics/chart')
      .query({ userId, period, type, unit })
      .expect(200)
      .expect(chartData);
  });

  afterAll(async () => {
    await app.close();
  });
});
