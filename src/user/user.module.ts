import { KafkaModule } from '../messaging/kafka.module.js';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { entities } from './model/entity/entities.js';
import { UserResolver } from './resolver/user.resolver.js';
import { UserService } from './service/user.service.js';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => KafkaModule),
    TypeOrmModule.forFeature(entities),
    KeycloakModule,
  ],
  // Provider sind z.B. Service-Klassen fuer DI
  providers: [UserResolver, UserService],
  // Export der Provider fuer DI in anderen Modulen
  exports: [UserService],
})
export class UserModule {}
