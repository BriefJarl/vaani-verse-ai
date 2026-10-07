import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';
import { envSchema } from './config/env.validation.js';
import configuration from './config/configuration.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: false,
      validationSchema: envSchema,
      load: [configuration],
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 120,
          blockDuration: 60_000,
        },
      ],
    }),

    HealthModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
