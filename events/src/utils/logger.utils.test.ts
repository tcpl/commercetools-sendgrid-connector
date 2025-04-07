import { getLogger } from './logger.utils';

describe('getLogger', () => {
  it('should return a logger instance', () => {
    const logger = getLogger();

    expect(logger).toBeDefined();
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('error');
  });

  //   it('should return the same logger instance on subsequent calls', () => {
  //     const logger1 = getLogger();
  //     const logger2 = getLogger();

  //     expect(logger1).toBe(logger2);
  //   });
});
