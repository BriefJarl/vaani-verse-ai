export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'Vaani Verse API',
    nodeEnv: process.env.NODE_ENV ?? 'development',

    port: Number(process.env.PORT ?? 4000),

    host: process.env.HOST ?? '0.0.0.0',

    logLevel: process.env.LOG_LEVEL ?? 'log',

    corsOrigins: (process.env.CORS_ORIGINS ??
      'http://localhost:3000,http://localhost:5173,http://localhost:8081')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),

    swaggerEnabled:
      (process.env.SWAGGER_ENABLED ?? 'true') === 'true',
  },
});
