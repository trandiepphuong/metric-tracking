import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeEnum } from '../../enums/type';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';

describe('MetricController (e2e)', () => {
  let app: INestApplication;

  const mockMetricService = {
    create: jest.fn(),
    getMetrics: jest.fn(),
    getChartData: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricController],
      providers: [
        {
          provide: MetricService,
          useValue: mockMetricService,
        },
      ],
    })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    // app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  describe('/POST metrics (createMetric)', () => {
    it('/POST metrics (createMetric) success', async () => {
      const createMetricDto = {
        userId: '1',
        type: TypeEnum.DISTANCE,
        value: 100,
        unit: 'km',
        date: new Date(),
      };

      const result = { ...createMetricDto, id: '1', date: createMetricDto.date.toString() };
      jest.spyOn(mockMetricService, 'create').mockResolvedValue(result);

      return request(app.getHttpServer())
        .post('/metrics')
        .send(createMetricDto)
        .expect(201)
        .expect(result);
    });

    it('/POST metrics (createMetric) fail because of validator', async () => {
      const invalidMetricDto = {
        userId: 123, // Invalid type
        type: 'INVALID_TYPE', // Invalid enum
        value: 'not-a-number', // Invalid type
        unit: 123, // Invalid type
        date: 'invalid-date', // Invalid date string
      };

      return request(app.getHttpServer())
        .post('/metrics')
        .send(invalidMetricDto)
        .expect(400)
        .expect({
          message: [
            'property userId should not exist',
            'property type should not exist',
            'property value should not exist',
            'property unit should not exist',
            'property date should not exist'
          ],
          error: 'Bad Request',
          statusCode: 400
        });
    });
  })
  
  it('/GET metrics (getMetricsByType)', async () => {
    const userId = '1';
    const type = TypeEnum.TEMPERATURE;
    const metrics = [
      { id: '1', userId, type, value: 30, unit: 'C', date: new Date().toString() },
    ];

    jest.spyOn(mockMetricService, 'getMetrics').mockResolvedValue(metrics);

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
      { id: '1', userId, type, value: 100, unit, date: new Date().toString() },
    ];

    jest.spyOn(mockMetricService, 'getChartData').mockResolvedValue(chartData);

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
