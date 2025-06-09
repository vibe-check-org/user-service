import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/entity/user.entity.js';
import { CreateUserInput } from '../model/input/create-user.input.js';
import { Adresse } from '../model/entity/adresse.entity.js';

@Injectable()
export class UserService {
    readonly #userRepo: Repository<User>;
    readonly #adresseRepo: Repository<Adresse>;
    constructor(
        @InjectRepository(User)
        userRepo: Repository<User>,
        @InjectRepository(Adresse)
        adresseRepo: Repository<Adresse>,
    ) {
        this.#userRepo = userRepo;
        this.#adresseRepo = adresseRepo;
    }

    async create(input: CreateUserInput): Promise<User> {
        const user = this.#userRepo.create({
            ...input,
            adressen: input.adressen?.map((adresseInput) =>
                this.#adresseRepo.create(adresseInput),
            ),
        });

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
}
