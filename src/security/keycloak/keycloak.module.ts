// eslint-disable-next-line max-classes-per-file
import { KeycloakGuard } from './guards/keycloak.guard.js';
import { KeycloakAdminService } from './keycloak-admin.service.js';
import { KeycloakService } from './keycloak.service.js';
import { EmailVerificationController } from './token.controller.js';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakConnectModule } from 'nest-keycloak-connect';

@Module({
  providers: [KeycloakService],
  exports: [KeycloakService],
})
class ConfigModule {}

@Module({
  controllers: [EmailVerificationController],
  imports: [
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakService,
      imports: [ConfigModule],
    }),
  ],
  providers: [
    KeycloakService,
    KeycloakAdminService,
    {
      provide: APP_GUARD,
      useClass: KeycloakGuard,
    },
  ],
  exports: [KeycloakConnectModule, KeycloakService, KeycloakAdminService],
})
export class KeycloakModule {}
