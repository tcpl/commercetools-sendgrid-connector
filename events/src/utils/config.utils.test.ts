import { readConfiguration } from './config.utils';

describe('Config utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });
  afterAll(() => {
    process.env = originalEnv;
  });

  it('should throw error when environment variables are missing', () => {
    expect(() => {
      readConfiguration();
    }).toThrow();
  });
});
