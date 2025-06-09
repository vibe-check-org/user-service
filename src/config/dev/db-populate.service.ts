import { getLogger } from '../../logger/logger.js';
import {
    adminDataSourceOptions,
    dbPopulate,
    dbResourcesDir,
    typeOrmModuleOptions,
} from '../typeormOptions.js';
import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';

/**
 * Die Test-DB wird im Development-Modus neu geladen, nachdem die Module
 * initialisiert sind, was durch `OnApplicationBootstrap` realisiert wird.
 *
 * DB-Migration mit TypeORM (ohne Nest):
 */
@Injectable()
export class DbPopulateService implements OnApplicationBootstrap {
    readonly #tabellen = ['user', 'adresse'];

    readonly #datasource: DataSource;

    readonly #resourcesDir = dbResourcesDir;

    readonly #logger = getLogger(DbPopulateService.name);

    /**
     * Initialisierung durch DI mit `DataSource` für SQL-Queries.
     */
    constructor(@InjectDataSource() dataSource: DataSource) {
        this.#datasource = dataSource;
    }

    /**
     * Die Test-DB wird im Development-Modus neu geladen.
     */
    async onApplicationBootstrap() {
        await this.populateTestdaten();
    }

    async populateTestdaten() {
        if (!dbPopulate) {
            return;
        }

        this.#logger.warn(`${typeOrmModuleOptions.type}: DB wird neu geladen`);
        await this.#populatePostgres();
        this.#logger.warn('DB wurde neu geladen');
    }

    async #populatePostgres() {
        const dropScript = resolve(this.#resourcesDir, 'drop.sql');
        this.#logger.debug('dropScript = %s', dropScript);

        const dropStatements = readFileSync(dropScript, 'utf8');
        await this.#datasource.query(dropStatements);

        const createScript = resolve(this.#resourcesDir, 'create.sql');
        this.#logger.debug('createScript = %s', createScript);

        const createStatements = readFileSync(createScript, 'utf8');
        await this.#datasource.query(createStatements);

        // COPY zum Laden von CSV-Dateien erfordert Administrationsrechte
        const dataSource = new DataSource(adminDataSourceOptions);
        await dataSource.initialize();
        await dataSource.query(
            `SET search_path TO ${adminDataSourceOptions.schema};`,
        );
        const copyStmt =
            "COPY \"%TABELLE%\" FROM '/csv/user/%TABELLE%.csv' (FORMAT csv, DELIMITER ',', HEADER true);";

        for (const tabelle of this.#tabellen) {
            await dataSource.query(copyStmt.replaceAll('%TABELLE%', tabelle));
        }
        await dataSource.destroy();
    }
}
