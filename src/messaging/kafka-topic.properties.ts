/* eslint-disable @typescript-eslint/no-unsafe-argument */
/**
 * Zentrale Konfiguration aller Kafka-Topics im System.
 * Dient der Typsicherheit, Übersichtlichkeit und Wiederverwendbarkeit in Publishern und Handlern.
 */

export const KafkaTopics = {
    orchestrator: {
        shutdown: 'user.shutdown.orchestrator',
        start: 'user.start.orchestrator',
        restart: 'user.restart.orchestrator',

        all: {
            shutdown: 'all.shutdown.orchestrator',
            start: 'all.start.orchestrator',
            restart: 'all.restart.orchestrator',
        },
    },
    notification: {
        create: 'notification.create.user',
        update: 'notification.update.user',
        delete: 'notification.delete.user',
    },
    logStream: {
        log: 'log-stream.log.user',
    },
} as const;

/**
 * Type-safe Zugriff auf Topic-Namen.
 * Beispiel: `KafkaTopics.U.CustomerDeleted`
 */
export type KafkaTopicsType = typeof KafkaTopics;

/**
 * Hilfsfunktion zur Auflistung aller konfigurierten Topic-Namen (z.B. für Subscriptions).
 */
export function getAllKafkaTopics(): string[] {
    const flatten = (obj: any): string[] =>
        Object.values(obj).flatMap((value) =>
            typeof value === 'string' ? [value] : flatten(value),
        );
    return flatten(KafkaTopics);
}

/**
 * Gibt alle Kafka-Topics zurück, optional gefiltert nach Top-Level-Kategorien.
 * @param keys z.B. ['User']
 */
export function getKafkaTopicsBy(keys: string[]): string[] {
    const result: string[] = [];
    for (const key of keys) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const section = (KafkaTopics as Record<string, any>)[key];
        if (section && typeof section === 'object') {
            for (const topic of Object.values(section)) {
                if (typeof topic === 'string') {
                    result.push(topic);
                }
            }
        }
    }
    return result;
}
