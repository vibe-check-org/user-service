import { TraceModule } from '../trace/trace.module.js';
import { OrchestratorHandler } from './handlers/orchestrator.handler.js';
import { KafkaConsumerService } from './kafka-consumer.service.js';
import { KafkaEventDispatcherService } from './kafka-event-dispatcher.service.js';
import { KafkaHeaderBuilder } from './kafka-header-builder.js';
import { KafkaProducerService } from './kafka-producer.service.js';
import { forwardRef, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule, forwardRef(() => TraceModule)],
  providers: [
    KafkaProducerService,
    KafkaConsumerService,
    KafkaEventDispatcherService,
    KafkaHeaderBuilder,
    OrchestratorHandler,
  ],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
