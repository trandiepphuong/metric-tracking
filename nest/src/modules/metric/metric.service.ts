import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { TypeEnum } from '../../enums/type';
import { convertUnit } from '../../utils/unitConversion';
import type { Repository } from 'typeorm';
import type { CreateMetricDto } from './dtos/create-metric.dto';
import { MetricEntity } from './metric.entity';

@Injectable()
export class MetricService {
    constructor(
        @InjectRepository(MetricEntity)
        private readonly metricRepository: Repository<MetricEntity>,
    ) { }

    async create(createMetricDto: CreateMetricDto): Promise<MetricEntity> {
        const metric = new MetricEntity();
        metric.userId = createMetricDto.userId;
        metric.type = createMetricDto.type;
        metric.value = createMetricDto.value;
        metric.unit = createMetricDto.unit;
        metric.date = new Date(createMetricDto.date);

        return this.metricRepository.save(metric);
    }

    async getMetrics(type: TypeEnum, userId: string): Promise<MetricEntity[]> {
        return await this.metricRepository.find({
            where: { type, userId },
        });
    }

    async getChartData(userId: string, period: number, type: TypeEnum, unit?: string): Promise<MetricEntity[]> {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - period);

        const query = `
            SELECT DISTINCT ON (DATE(date)) *
            FROM metric
            WHERE user_id = $1 AND type = $2 AND date >= $3
            ORDER BY DATE(date), date DESC
        `;

        const metrics = await this.metricRepository.query(query, [
            userId,
            type,
            startDate.toISOString(),
        ]);

        if (unit) {
            return metrics.map((metric: MetricEntity) => (
                {
                    ...metric,
                    value: convertUnit(metric.type, metric.unit, unit, metric.value),
                    unit
                }
            ))
        };

        return metrics;
    }
}
