import { keycloakConnectOptions, paths } from '../../config/keycloak.js';
import { getLogger } from '../../logger/logger.js';
import { User } from '../../user/model/entity/user.entity.js';
import { KeycloakService } from './keycloak.service.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

const { authServerUrl } = keycloakConnectOptions;

export type UserInput = {
  vorname: string;
  nachname: string;
  email: string;
  name: string;
}

@Injectable()
export class KeycloakAdminService {
  readonly #client: AxiosInstance;
  readonly #logger = getLogger(KeycloakAdminService.name);
  readonly #keycloakService: KeycloakService;

  constructor(keycloakService: KeycloakService) {
    this.#client = axios.create({ baseURL: authServerUrl });
    this.#keycloakService = keycloakService;
  }

  async signIn(user: UserInput, password: string, roleName: string) {
    this.#logger.debug('signIn: user=%o, roleName=%s', user, roleName);
    const userData = {
      username: user.name,
      enabled: true,
      firstName: user.vorname,
      lastName: user.nachname,
      email: user.email,
      credentials: [{ type: 'password', value: password, temporary: false }],
    };
    this.#logger.debug('signIn: userData=%o', userData);
    const adminToken = await this.getAdminToken();

    try {
      await this.#client.post(paths.admin, userData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      const userId = await this.getUserIdByUsername(adminToken, user.name);
      await this.assignRoleToUser(userId, roleName, adminToken);
      return userId;
    } catch (error: any) {
      this.#logger.error('signIn failed: %o', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        stack: error?.stack,
      });
      throw new Error('Benutzer konnte nicht erstellt werden.');
    }
  }

  async update(user: User, userId: string, token: string) {
    const updateData = {
      firstName: user.vorname,
      lastName: user.nachname,
      email: user.email,
      username: user.name,
      enabled: true,
    };

    try {
      await this.#client.put(`${paths.admin}/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      this.#logger.error('update failed: %o', e);
      throw new Error('Aktualisierung fehlgeschlagen');
    }
  }

  async updatePassword(
    userId: string,
    newPassword: string,
    adminToken: string,
  ) {
    const passwordData = {
      type: 'password',
      value: newPassword,
      temporary: false,
    };

    try {
      await this.#client.put(
        `${paths.admin}/${userId}/reset-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      this.#logger.error('updatePassword failed: %o', e);
      throw new Error('Passwort konnte nicht gesetzt werden.');
    }
  }

  async delete(username: string, token: string) {
    this.#logger.debug('delete: username=%s', username);
    const userId = await this.getUserIdByUsername(token, username);
    this.#logger.debug('delete: userId=%s', userId);
    try {
      await this.#client.delete(`${paths.admin}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      this.#logger.error('delete failed: %o', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        stack: error?.stack,
      });
      throw new Error('Benutzer konnte nicht gelöscht werden.');
    }
  }

  async assignRoleToUser(userId: string, roleName: string, adminToken: string) {
    const roles = await this.getRoles(adminToken);
    const role = roles.find((r: any) => r.name === roleName);

    if (!role) {
      throw new Error(`Rolle ${roleName} nicht gefunden`);
    }

    const roleData = [{ id: role.id, name: role.name }];

    try {
      await this.#client.post(
        `${paths.admin}/${userId}/role-mappings/realm`,
        roleData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      this.#logger.error('assignRoleToUser failed: %o', e);
      throw new Error('Rolle konnte nicht zugewiesen werden.');
    }
  }

  async getUserIdByUsername(token: string, username: string): Promise<string> {
    const res = await this.#client.get(`${paths.admin}?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = res.data?.[0];
    if (!user)
      throw new NotFoundException(`Benutzer nicht gefunden: ${username}`);
    return user.id;
  }

  async getRoles(token: string) {
    const res = await this.#client.get(paths.roles, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  async getAdminToken(): Promise<string> {
    const token = await this.#keycloakService.login({
      username: 'admin',
      password: 'p',
    });
    if (!token) {
      throw new Error('Admin-Token konnte nicht abgerufen werden.');
    }
    return token.access_token as string;
  }
}
