export interface LogEventDTO {
    id: string;
    timestamp: string;
    level: string;
    message: string;
    service: string;
    context: string;
    traceId?: string;
}
