/* eslint-disable camelcase, @typescript-eslint/naming-convention */

import { keycloakConnectOptions, paths } from '../../config/keycloak.js';
import { getLogger } from '../../logger/logger.js';
import { Injectable } from '@nestjs/common';
import axios, {
  AxiosResponse,
  RawAxiosRequestHeaders,
  type AxiosInstance,
} from 'axios';
import {
  type KeycloakConnectOptions,
  type KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';

const { authServerUrl, clientId, secret } = keycloakConnectOptions;

/** Typdefinition für Eingabedaten zu einem Token. */
export type TokenData = {
  readonly username: string | undefined;
  readonly password: string | undefined;
};

@Injectable()
export class KeycloakService implements KeycloakConnectOptionsFactory {
  readonly #loginHeaders: RawAxiosRequestHeaders;
  readonly #keycloakClient: AxiosInstance;

  readonly #logger = getLogger(KeycloakService.name);

  constructor() {
    const authorization = Buffer.from(`${clientId}:${secret}`, 'utf8').toString(
      'base64',
    );
    this.#loginHeaders = {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    this.#keycloakClient = axios.create({
      baseURL: authServerUrl!,
      // ggf. httpsAgent fuer HTTPS bei selbst-signiertem Zertifikat
    });
    this.#logger.debug('keycloakClient=%o', this.#keycloakClient.defaults);
  }

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return keycloakConnectOptions;
  }

  async login({ username, password }: TokenData) {
    this.#logger.debug('login: username=%s', username);
    if (username === undefined || password === undefined) {
      return null;
    }

    const loginBody = `grant_type=password&username=${username}&password=${password}&scope=openid`;
    let response: AxiosResponse<Record<string, number | string>>;
    try {
      response = await this.#keycloakClient.post(paths.accessToken, loginBody, {
        headers: this.#loginHeaders,
      });
    } catch {
      this.#logger.warn('login: Fehler bei %s', paths.accessToken);
      return null;
    }

    this.#logger.debug('login: response.data=%o', response.data);
    return response.data;
  }

  async getToken(context: any) {
    const rawAuth = context.req?.headers?.authorization;
    const token =
      typeof rawAuth === 'string' && rawAuth.startsWith('Bearer ')
        ? rawAuth.slice(7)
        : null;

    const [, payloadStr] = (token as string).split('.');
    const payloadDecoded = atob(payloadStr);
    const payload = JSON.parse(payloadDecoded);
    const { exp, realm_access, preferred_username, email } = payload;
    this.#logger.debug('getToken: exp=%s', exp);
    const { roles } = realm_access;
    this.#logger.debug('getToken: roles=%o ', roles);

    return { username: preferred_username, email, roles, token };
  }
}
/* eslint-enable camelcase, @typescript-eslint/naming-convention */
