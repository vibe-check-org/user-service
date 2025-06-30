import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/entity/user.entity.js';
import { CreateUserInput } from '../model/input/create-user.input.js';
import { Adresse } from '../model/entity/adresse.entity.js';
import { KeycloakAdminService } from '../../security/keycloak/keycloak-admin.service.js';

@Injectable()
export class UserService {
    readonly #userRepo: Repository<User>;
    readonly #adresseRepo: Repository<Adresse>;
    readonly #keycloakAdminService: KeycloakAdminService;

    constructor(
        @InjectRepository(User)
        userRepo: Repository<User>,
        @InjectRepository(Adresse)
        adresseRepo: Repository<Adresse>,
        keycloakAdminService: KeycloakAdminService,
    ) {
        this.#userRepo = userRepo;
        this.#adresseRepo = adresseRepo;
        this.#keycloakAdminService = keycloakAdminService;
    }

    async create(input: CreateUserInput): Promise<User> {
        const user = this.#userRepo.create({
            ...input,
            name: input.username,
            adressen: input.adressen?.map((adresseInput) =>
                this.#adresseRepo.create(adresseInput),
            ),
        });

        const password = input.password;
        const roleName = input.rolle;
        await this.#keycloakAdminService.signIn(
            user,
            password,
            roleName,
        );

        return await this.#userRepo.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.#userRepo.find({ relations: ['adressen'] });
    }

    async findById(id: string): Promise<User> {
        const user = await this.#userRepo.findOne({
            where: { id },
            relations: ['adressen'],
        });

        if (!user) {
            throw new NotFoundException(
                `Benutzer mit ID ${id} nicht gefunden.`,
            );
        }

        return user;
    }

    async delete(id: string, token: string) {
        const user = await this.#userRepo.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(
                `Benutzer mit ID ${id} nicht gefunden.`,
            );
        }

        // Löschen der Adressen des Benutzers
        if (user.adressen) {
            await this.#adresseRepo.remove(user.adressen);
        }

        await this.#keycloakAdminService.delete(user.name, token);

        // Löschen des Benutzers
        await this.#userRepo.remove(user);
        return user.name;
    }
}
