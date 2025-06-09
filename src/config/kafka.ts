/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { config } from './app.js';

const { kafka } = config;

export const kafkaBroker = `${kafka.host}:9092`;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const groupId = kafka.groupId;
console.log('kafka Host is %s', kafkaBroker);
