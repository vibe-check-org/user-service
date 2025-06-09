/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Das Modul besteht aus Security-Funktionen für z.B. CSP, XSS, Click-Jacking,
 * HSTS und MIME-Sniffing, die durch Helmet bereitgestellt werden.
 * @packageDocumentation
 */

// Alternative zu helmet: lusca von Kraken
import {
    contentSecurityPolicy,
    frameguard,
    hidePoweredBy,
    hsts,
    noSniff,
    xssFilter,
} from 'helmet';

/**
 * Security-Funktionen für z.B. CSP, XSS, Click-Jacking, HSTS und MIME-Sniffing.
 */
export const helmetHandlers = [
    // CSP = Content Security Policy
    contentSecurityPolicy({
        useDefaults: true,
        directives: {
            defaultSrc: ["https: 'self'"],
            // fuer GraphQL IDE => GraphiQL
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
            scriptSrc: ["https: 'unsafe-inline' 'unsafe-eval'"],
            // fuer GraphQL IDE => GraphiQL
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src
            imgSrc: ["data: 'self'"],
        },
        reportOnly: false,
    }),

    // XSS = Cross-site scripting attacks: Header X-XSS-Protection
    xssFilter(),

    // Clickjacking
    frameguard(),

    // HSTS = HTTP Strict Transport Security:
    //   Header Strict-Transport-Security
    hsts(),

    // MIME-sniffing: im Header X-Content-Type-Options
    noSniff(),

    // Im Header z.B. "X-Powered-By: Express" unterdruecken
    hidePoweredBy(),
];
