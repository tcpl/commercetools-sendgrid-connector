import { it, expect } from '@jest/globals';
import envValidators from '../validators/env.validators';
import { Configuration } from '../types/config.interface';
import { getValidateMessages } from './helpers.validators';
import { getConfig } from '../utils/test-helpers/test-config-helper';

it('valid configuration should return no errors', () => {
  const validationErrors = validate();

  expect(validationErrors).toEqual([]);
});

it('invalid clientId should return error', () => {
  const validationErrors = validate({ clientId: 'invalidClientId' });

  expect(validationErrors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'InvalidClientId',
      }),
    ])
  );
});

it('invalid clientSecret should return error', () => {
  const validationErrors = validate({ clientSecret: 'invalidClientSecret' });

  expect(validationErrors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'InvalidClientSecret',
      }),
    ])
  );
});

it('invalid projectKey should return error', () => {
  const validationErrors = validate({ projectKey: '' });

  expect(validationErrors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'InvalidProjectKey',
      }),
    ])
  );
});

it('invalid otlpExporterEndpoint should return error', () => {
  const validationErrors = validate({ otlpExporterEndpoint: 'invalidHost' });

  expect(validationErrors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'InvalidOtlpExporterEndpoint',
      }),
    ])
  );
});

it('invalid otlpExporterEndpointApiKey should return error', () => {
  const validationErrors = validate({ otlpExporterEndpointApiKey: '0' });

  expect(validationErrors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'InvalidOtlpExporterHostApiKey',
      }),
    ])
  );
});

it('invalid Sendgrif API Key should return error', () => {
  // token too short
  const validationErrors = validate({ sendgridApiKey: 'abc' });

  expect(validationErrors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'InvalidSendgridApiKey',
      }),
    ])
  );
});

const validate = (overrides?: object) => {
  const envVars: Configuration = {
    ...getConfig(),
    ...overrides,
  };

  return getValidateMessages(envValidators, envVars);
};
