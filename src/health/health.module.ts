import { HealthController } from './health.controller.js';
import { KafkaIndicator } from './kafka.indicator.js';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.health.env',
      isGlobal: true,
    }),
    TerminusModule,
    TypeOrmModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [KafkaIndicator],
})
export class HealthModule {}
