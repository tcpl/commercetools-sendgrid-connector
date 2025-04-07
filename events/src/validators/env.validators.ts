import {
  optional,
  standardString,
  standardKey,
  standardUrl,
} from './helpers.validators';

const envValidators = [
  standardString(
    ['clientId'],
    {
      code: 'InvalidClientId',
      message: 'Client id should be 24 characters.',
      referencedBy: 'environmentVariables',
    },
    { min: 24, max: 24 }
  ),

  standardString(
    ['clientSecret'],
    {
      code: 'InvalidClientSecret',
      message: 'Client secret should be 32 characters.',
      referencedBy: 'environmentVariables',
    },
    { min: 32, max: 32 }
  ),

  standardKey(['projectKey'], {
    code: 'InvalidProjectKey',
    message: 'Project key should be a valid string.',
    referencedBy: 'environmentVariables',
  }),

  optional(standardString)(
    ['scope'],
    {
      code: 'InvalidScope',
      message: 'Scope should be at least 2 characters long.',
      referencedBy: 'environmentVariables',
    },
    { min: 2, max: undefined }
  ),

  standardUrl(['authUrl'], {
    code: 'InvalidAuthUrl',
    message: 'CTP_AUTH_URL is not a valid URL.',
    referencedBy: 'environmentVariables',
  }),

  standardUrl(['apiUrl'], {
    code: 'InvalidApiUrl',
    message: 'CTP_API_URL is not a valid URL.',
    referencedBy: 'environmentVariables',
  }),

  standardString(
    ['sendgridApiKey'],
    {
      code: 'InvalidSendgridApiKey',
      message: 'Sendgrid key must be present.',
      referencedBy: 'environmentVariables',
    },
    { min: 4, max: undefined }
  ),

  optional(standardUrl)(['otlpExporterEndpoint'], {
    code: 'InvalidOtlpExporterEndpoint',
    message: 'Otlp Exporter Host is not a valid URL.',
    referencedBy: 'environmentVariables',
  }),

  optional(standardString)(
    ['otlpExporterEndpointApiKey'],
    {
      code: 'InvalidOtlpExporterHostApiKey',
      message: 'Otlp key not correct.',
      referencedBy: 'environmentVariables',
    },
    { min: 4, max: 128 }
  ),
];

export default envValidators;
