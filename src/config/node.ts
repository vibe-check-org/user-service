import { RESOURCES_DIR, config } from './app.js';
import { env } from './env.js';
import { hostname } from 'node:os';

const { NODE_ENV } = env;
const { db } = config;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const database = db?.database as string | undefined;

const computername = hostname();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const port = (config.node?.port as number | undefined) ?? 3000;

export const nodeConfig = {
  host: computername,
  port,
  resourcesDir: RESOURCES_DIR,
  databaseName: database,
  nodeEnv: NODE_ENV as
    | 'development'
    | 'PRODUCTION'
    | 'production'
    | 'test'
    | undefined,
} as const;
