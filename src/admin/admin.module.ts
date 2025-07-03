import { HealthController } from './health.controller.js';
import { PrometheusController } from './prometheus.controller.js';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController, PrometheusController],
})
export class AdminModule {}
