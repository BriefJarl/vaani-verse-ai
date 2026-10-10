import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('returns the expected liveness response', () => {
    const controller = new HealthController();

    expect(controller.check()).toEqual({
      status: 'ok',
    });
  });
});
