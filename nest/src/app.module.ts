import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { MetricModule } from './modules/metric/metric.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'metric-tracking',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true, // false in prod
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MetricModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
