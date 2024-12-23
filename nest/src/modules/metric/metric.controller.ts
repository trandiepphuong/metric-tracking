import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TypeEnum } from '../../enums/type';
import { CreateMetricDto } from './dtos/create-metric.dto';
import { MetricService } from './metric.service';

@Controller('metrics')
export class MetricController {
    constructor(private readonly metricService: MetricService) {
    }

    @Post()
    createMetric(@Body() createMetricDto: CreateMetricDto) {
        return this.metricService.create(createMetricDto);
    }

    @Get()
    async getMetricsByType(@Query('type') type: TypeEnum, @Query('userId') userId: string) {
        return await this.metricService.getMetrics(type, userId);
    }

    @Get('/chart')
    getChartData(
        @Query('userId') userId: string,
        @Query('period') period: number,
        @Query('type') type: TypeEnum,
        @Query('unit') unit: string,
    ) {
        return this.metricService.getChartData(userId, period, type, unit);
    }
}
