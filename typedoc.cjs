/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    out: '.extras/doc/api',
    entryPoints: ['src'],
    includeVersion: true,
    // plugin: ['typedoc-plugin-markdown'],
    entryPointStrategy: 'expand',
    excludeExternals: true,
    excludePrivate: true,
    theme: 'default',
    // favicon: 'favicon.ico',
    validation: {
        invalidLink: true,
    },
    name: 'Vibe Check GatewayAPI Documentation',
    readme: './README.md',
};
