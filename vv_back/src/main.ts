import {
  ConsoleLogger,
  ValidationPipe,
  filterLogLevels,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from '@fastify/helmet';

import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

async function bootstrap(): Promise<void> {
  const app =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        bodyLimit: 1_048_576,
      }),
      {
        bufferLogs: true,
      },
    );

  const config =
    app.get(ConfigService);

  const nodeEnv =
    config.get<string>(
      'app.nodeEnv',
      'development',
    );

  const logLevel =
    config.get<string>(
      'app.logLevel',
      'log',
    );

  const logger = new ConsoleLogger({
    json: nodeEnv !== 'development',
    flattenParams: true,
    logLevels: filterLogLevels(logLevel),
  });

  app.useLogger(logger);

  const appName =
    config.get<string>(
      'app.name',
      'Vaani Verse API',
    );

  const port =
    config.get<number>(
      'app.port',
      4000,
    );

  const host =
    config.get<string>(
      'app.host',
      '0.0.0.0',
    );

  const corsOrigins =
    config.get<string[]>(
      'app.corsOrigins',
      [],
    );

  const swaggerEnabled =
    config.get<boolean>(
      'app.swaggerEnabled',
      true,
    );

  // All REST API endpoints live under /api/v1.
  app.setGlobalPrefix('api/v1');

  // Explicit CORS allow-list.
  app.enableCors({
    origin: corsOrigins,
    methods: [
      'GET',
      'HEAD',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'Idempotency-Key',
    ],
    exposedHeaders: [
      'X-Request-Id',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'Retry-After',
    ],
    credentials: false,
    maxAge: 86_400,
  });

  // Reject unexpected body properties and validate DTOs globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  // One consistent JSON error contract.
  app.useGlobalFilters(
    new AllExceptionsFilter(),
  );

  // Request correlation ID.
  const fastify =
    app.getHttpAdapter().getInstance();

  fastify.addHook(
    'onRequest',
    async (request, reply) => {
      reply.header(
        'X-Request-Id',
        String(request.id),
      );
    },
  );

  // Production-friendly request logging.
  fastify.addHook(
    'onResponse',
    async (request, reply) => {
      const requestLogger =
        new ConsoleLogger({
          json: nodeEnv !== 'development',
          flattenParams: true,
          logLevels: filterLogLevels(logLevel),
        });

      requestLogger.log(
        'HTTP request completed',
        {
          requestId: String(request.id),
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
          responseTimeMs:
            Number(
              reply.elapsedTime.toFixed(2),
            ),
        },
      );
    },
  );

  // Security headers.
  //
  // Swagger UI + Fastify Helmet can conflict through CSP.
  // During local development we disable CSP so Swagger works.
  // Production will use the normal Helmet CSP defaults.
  await app.register(
    helmet,
    nodeEnv === 'development'
      ? {
          contentSecurityPolicy: false,
        }
      : {},
  );

  // Swagger / OpenAPI.
  if (swaggerEnabled) {
    const swaggerConfig =
      new DocumentBuilder()
        .setTitle(appName)
        .setDescription(
          'Vaani Verse — Voice-first agentic productivity platform API',
        )
        .setVersion('1.0.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          'access-token',
        )
        .build();

    const documentFactory =
      () =>
        SwaggerModule.createDocument(
          app,
          swaggerConfig,
        );

    SwaggerModule.setup(
      'docs',
      app,
      documentFactory,
      {
        useGlobalPrefix: false,
        jsonDocumentUrl: 'docs-json',
      },
    );
  }

  // Allow Nest/Terminus/workers to perform graceful shutdown later.
  app.enableShutdownHooks();

  await app.listen(
    port,
    host,
  );

  logger.log(
    'Vaani Verse API started',
    {
      environment: nodeEnv,
      host,
      port,
      apiBaseUrl: `http://localhost:${port}/api/v1`,
      swagger:
        swaggerEnabled
          ? `http://localhost:${port}/docs`
          : 'disabled',
    },
  );
}

void bootstrap();
