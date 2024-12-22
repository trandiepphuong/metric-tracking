import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricController } from './metric.controller';
import { MetricEntity } from './metric.entity';
import { MetricService } from './metric.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetricEntity])],
  controllers: [MetricController],
  providers: [MetricService]
})
export class MetricModule { }
