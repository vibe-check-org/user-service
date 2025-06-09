/**
 * Das Modul besteht aus den Klassen für die Fehlerbehandlung bei GraphQL.
 * @packageDocumentation
 */

import { GraphQLError } from 'graphql';
/**
 * Error-Klasse für GraphQL, die einen Response mit `errors` und
 * code `BAD_USER_INPUT` produziert.
 */
export class BadUserInputError extends GraphQLError {
    constructor(message: string, exception?: Error) {
        super(message, {
            originalError: exception,
            extensions: {
                code: 'BAD_USER_INPUT',
            },
        });
    }
}
