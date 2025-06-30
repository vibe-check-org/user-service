import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from '../model/entity/user.entity.js';
import { UserService } from '../service/user.service.js';
import { CreateUserInput } from '../model/input/create-user.input.js';
import { Public, Roles } from 'nest-keycloak-connect';
import { KeycloakService } from '../../security/keycloak/keycloak.service.js';

@Resolver(() => User)
export class UserResolver {
    readonly #userService: UserService;
    readonly #keycloakService: KeycloakService;

    constructor(userService: UserService, keycloakService: KeycloakService) {
        this.#keycloakService = keycloakService;
        this.#userService = userService;
    }

    @Query(() => [User])
    @Roles({ roles: ['Admin'] })
    findAllUser() {
        return this.#userService.findAll();
    }

    @Query(() => User)
    @Roles({ roles: ['Admin', 'User'] })
    findById(@Args('id') id: string) {
        return this.#userService.findById(id);
    }

    @Mutation(() => User)
    @Public()
    createUser(@Args('input') daten: CreateUserInput) {
        return this.#userService.create(daten);
    }

    @Mutation(() => String)
    @Public()
    async deleteUser(
        @Args('id') id: string,
        @Context() context: any,
    ) {
        const { token } = await this.#keycloakService.getToken(context);
        const username = await this.#userService.delete(id, token);
        return `User ${username} wurde erfolgreich gelöscht.`;
    }
}
