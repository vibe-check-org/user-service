import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from '../model/entity/user.entity.js';
import { UserService } from '../service/user.service.js';
import { CreateUserInput } from '../model/input/create-user.input.js';
import { Public, Roles } from 'nest-keycloak-connect';

@Resolver(() => User)
export class UserResolver {
    readonly #userService: UserService;

    constructor(userService: UserService) {
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
}
