import { getLogger } from './logger.utils';

describe('getLogger', () => {
  it('should return a logger instance', () => {
    const logger = getLogger();

    expect(logger).toBeDefined();
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('error');
  });
});
