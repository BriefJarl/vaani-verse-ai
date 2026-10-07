import {
  Controller,
  Get,
  Header,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('System')
@Controller('health')
@SkipThrottle()
export class HealthController {
  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Liveness health check',
    description:
      'Confirms that the Vaani Verse API process is alive and serving requests.',
  })
  @ApiOkResponse({
    description: 'API is healthy.',
    schema: {
      example: {
        status: 'ok',
      },
    },
  })
  check(): { status: 'ok' } {
    return {
      status: 'ok',
    };
  }
}
