import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './model/entity/entities.js';
import { KafkaModule } from '../messaging/kafka.module.js';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { UserResolver } from './resolver/user.resolver.js';
import { UserService } from './service/user.service.js';

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
