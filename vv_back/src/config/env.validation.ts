import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  APP_NAME: z
    .string()
    .min(1)
    .max(100)
    .default('Vaani Verse API'),

  PORT: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(4000),

  HOST: z
    .string()
    .min(1)
    .default('0.0.0.0'),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'log', 'verbose', 'debug'])
    .default('log'),

  CORS_ORIGINS: z
    .string()
    .min(1)
    .default(
      'http://localhost:3000,http://localhost:5173,http://localhost:8081',
    ),

  SWAGGER_ENABLED: z
    .enum(['true', 'false'])
    .default('true'),
});

export type ValidatedEnvironment = z.infer<typeof envSchema>;
