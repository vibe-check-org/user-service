import { KeycloakService } from '../../security/keycloak/keycloak.service.js';
import { User } from '../model/entity/user.entity.js';
import { CreateUserInput } from '../model/input/create-user.input.js';
import { UserService } from '../service/user.service.js';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Public, Roles } from 'nest-keycloak-connect';
import { UpdatePasswordInput, UpdateUserInput } from '../model/input/update-user.input.js';

@Resolver(() => User)
export class UserResolver {
  readonly #userService: UserService;
  readonly #keycloakService: KeycloakService;

  constructor(userService: UserService, keycloakService: KeycloakService) {
    this.#keycloakService = keycloakService;
    this.#userService = userService;
  }

  @Query(() => [User])
  @Roles({ roles: ['ADMIN'] })
  findAllUser() {
    return this.#userService.findAll();
  }

  @Query(() => User)
  @Roles({ roles: ['ADMIN', 'BEWERBER', 'RECRUITER'] })
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
  async deleteUser(@Args('id') id: string, @Context() context: any) {
    const { token } = await this.#keycloakService.getToken(context);
    const username = await this.#userService.delete(id, token);
    return `User ${username} wurde erfolgreich gelöscht.`;
  }

  @Mutation(() => User)
  @Roles({ roles: ['ADMIN', 'BEWERBER', 'RECRUITER'] })
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.#userService.update(id, input);
  }

  @Mutation(() => Boolean)
  @Roles({ roles: ['ADMIN', 'BEWERBER', 'RECRUITER'] })
  async updateUserPassword(
    @Args('input') input: UpdatePasswordInput,
    @Context() context: any,
  ): Promise<boolean> {
    const { token } = await this.#keycloakService.getToken(context);
    return this.#userService.updatePassword(input.id, input.newPassword, token);
  }
  


}
