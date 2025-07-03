import { User } from '../../user/model/entity/user.entity.js';
import { DbPopulateService } from './db-populate.service.js';
import { DevController } from './dev.controller.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [DevController],
  providers: [DbPopulateService],
  exports: [DbPopulateService],
})
export class DevModule {}
