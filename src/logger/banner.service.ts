/**
 * BannerService - Service zur Anzeige von Anwendungsinformationen und einem Startbanner.
 * BannerService
 * Dieser Service gibt beim Start der Anwendung ein Banner und wichtige Anwendungsinformationen aus.
 */

import { nodeConfig } from '../config/node.js';
import { getLogger } from './logger.js';
import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import cFonts from 'cfonts';
import chalk from 'chalk';
import { release, type, userInfo } from 'node:os';
import process from 'node:process';

/**
 * BannerService - Service zum Generieren und Ausgeben von Anwendungsinformationen sowie einem Banner.
 * Dieser Service wird beim Bootstrap der Anwendung verwendet, um sowohl ein benutzerdefiniertes Banner
 * als auch wichtige Systeminformationen auszugeben.
 */
@Injectable()
export class BannerService implements OnApplicationBootstrap {
  readonly #logger = getLogger(BannerService.name);

  /**
   * @description Wird beim Bootstrap der Anwendung ausgeführt, um Anwendungsinformationen und ein Banner auszugeben.
   */
  onApplicationBootstrap() {
    const { host, nodeEnv, port, databaseName } = nodeConfig;

    // Banner generieren und ausgeben
    this.#generateBanner();

    // Umgebungsinformationen mit Farben ausgeben
    this.#logger.info(chalk.green('=== Anwendungsinformationen ==='));
    this.#logger.info(chalk.cyan('Anwendungsname: ') + chalk.yellow('User'));
    this.#logger.info(
      chalk.cyan('Node.js-Version: ') + chalk.yellow(process.version),
    );
    this.#logger.info(chalk.cyan('Umgebung: ') + chalk.yellow(nodeEnv));
    this.#logger.info(chalk.cyan('Host: ') + chalk.yellow(host));
    this.#logger.info(chalk.cyan('Port: ') + chalk.yellow(port.toString()));
    this.#logger.info(chalk.cyan('Datenbank: ') + chalk.yellow(databaseName));
    this.#logger.info(
      chalk.cyan('Betriebssystem: ') + chalk.yellow(`${type()} (${release()})`),
    );
    this.#logger.info(
      chalk.cyan('Benutzer: ') + chalk.yellow(userInfo().username),
    );
    this.#logger.info(chalk.green('==============================='));
  }

  /**
   * @description Banner generieren und ausgeben.
   */
  #generateBanner() {
    cFonts.say('User', {
      font: 'block',
      align: 'left',
      gradient: ['#D88C60', '#FFD580'],
      background: 'transparent',
      letterSpacing: 1,
      lineHeight: 1,
    });
  }
}
