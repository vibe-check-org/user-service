import { KafkaProducerService } from '../../messaging/kafka-producer.service.js';
import { KeycloakAdminService } from '../../security/keycloak/keycloak-admin.service.js';
import { Adresse } from '../model/entity/adresse.entity.js';
import { User } from '../model/entity/user.entity.js';
import { CreateUserInput } from '../model/input/create-user.input.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from '../model/input/update-user.input.js';
import { VibeProfil } from '../model/entity/profile.entity.js';

@Injectable()
export class UserService {
  readonly #userRepo: Repository<User>;
  readonly #adresseRepo: Repository<Adresse>;
  readonly #profileRepo: Repository<VibeProfil>;
  readonly #keycloakAdminService: KeycloakAdminService;
  readonly #kafkaProducerService: KafkaProducerService;

  constructor(
    @InjectRepository(User)
    userRepo: Repository<User>,
    @InjectRepository(Adresse)
    adresseRepo: Repository<Adresse>,
    @InjectRepository(VibeProfil)
    profileRepo: Repository<VibeProfil>,
    keycloakAdminService: KeycloakAdminService,
    kafkaProducerService: KafkaProducerService,
  ) {
    this.#userRepo = userRepo;
    this.#profileRepo = profileRepo;
    this.#adresseRepo = adresseRepo;
    this.#keycloakAdminService = keycloakAdminService;
    this.#kafkaProducerService = kafkaProducerService;
  }

  async findAll(): Promise<User[]> {
    return this.#userRepo.find({ relations: ['adressen', 'profile'] });
  }

  async findById(id: string): Promise<User> {
    const user = await this.#userRepo.findOne({
      where: { id },
      relations: ['adressen', 'profile'],
    });
    if (!user) throw new NotFoundException(`Benutzer mit ID ${id} nicht gefunden.`);
    return user;
  }

  async create(input: CreateUserInput): Promise<User> {
    const keycloakUserId = await this.#keycloakAdminService.signIn(
      {
        vorname: input.vorname,
        nachname: input.nachname,
        email: input.email,
        name: input.username,
      },
      input.password,
      input.rolle,
    );

    const user = this.#userRepo.create({
      id: keycloakUserId, // Keycloak-ID als Primary Key
      ...input,
      name: input.username,
      adressen: input.adressen?.map((a) => this.#adresseRepo.create(a)),
    });

    // Leeres Profil erstellen
    const profil = this.#profileRepo.create({ user });
    await this.#profileRepo.save(profil);
    user.profile = profil;


    await this.#kafkaProducerService.sendMailNotification('create', {
      username: user.name,
      email: user.email,
      userId: keycloakUserId,
    }, 'user-service');

    return this.#userRepo.save(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.#userRepo.findOne({ where: { id }, relations: ['adressen', 'profile'] });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    Object.assign(user, input);
    await this.#userRepo.save(user);

    const adminToken = await this.#keycloakAdminService.getAdminToken()
    const userIdKeycloak = await this.#keycloakAdminService.getUserIdByUsername(adminToken, user.name);
    await this.#keycloakAdminService.update(user, userIdKeycloak, adminToken);

    return user;
  }

  async updatePassword(id: string, newPassword: string, token: string): Promise<boolean> {
    const user = await this.#userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Benutzer mit ID ${id} nicht gefunden.`);

    const userIdKeycloak = await this.#keycloakAdminService.getUserIdByUsername(token, user.name);
    await this.#keycloakAdminService.updatePassword(userIdKeycloak, newPassword, token);

    return true;
  }
  

  async delete(id: string, token: string) {
    const user = await this.#userRepo.findOne({ where: { id }, relations: ['adressen', 'profile'] });
    if (!user) throw new NotFoundException(`Benutzer mit ID ${id} nicht gefunden.`);

    if (user.adressen) await this.#adresseRepo.remove(user.adressen);
    await this.#keycloakAdminService.delete(user.name, token);
    await this.#userRepo.remove(user);

    return user.name;
  }
}
