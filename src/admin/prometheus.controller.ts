/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Das Modul besteht aus der Controller-Klasse für Prometheus-Requests.
 * @packageDocumentation
 */

import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import client from 'prom-client';

/**
 * Die Controller-Klasse für Metrik-Requests durch Prometheus.
 */
@Controller('metrics')
export class PrometheusController {
    readonly #register: client.Registry;
    readonly #contentType: string;

    constructor() {
        const { Registry } = client;
        this.#register = new Registry();
        this.#contentType = this.#register.contentType;

        const { collectDefaultMetrics } = client;
        client.collectDefaultMetrics({
            // !!!app: 'node-application-monitoring-app',
            prefix: 'node_',
            // !!!timeout: 10_000,
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
            register: this.#register,
        });
        collectDefaultMetrics({ register: this.#register });
    }

    @Get('')
    async metrics(@Res() res: Response<string>) {
        const metrics = await this.#register.metrics();
        return res.contentType(this.#contentType).send(metrics);
    }
}
