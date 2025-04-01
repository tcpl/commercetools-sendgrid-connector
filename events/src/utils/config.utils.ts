import CustomError from '../errors/custom.error';
import { Configuration } from '../types/config.interface';
import envValidators from '../validators/env.validators';
import { getValidateMessages } from '../validators/helpers.validators';

export const readConfiguration = (): Configuration => {
  const envVars = {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
    projectKey: process.env.CTP_PROJECT_KEY as string,
    scope: process.env.CTP_SCOPE as string,
    authUrl: process.env.CTP_AUTH_URL as string,
    apiUrl: process.env.CTP_API_URL as string,
    sendgridApiKey: process.env.SENDGRID_API_KEY as string,
    otlpExporterEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT as string,
    otlpExporterEndpointApiKey: process.env
      .OTEL_EXPORTER_OTLP_ENDPOINT_API_KEY as string,
  };

  const validationErrors = getValidateMessages(envValidators, envVars);

  if (validationErrors.length) {
    throw new CustomError(
      'InvalidEnvironmentVariablesError',
      'Invalid Environment Variables please check your .env file',
      validationErrors
    );
  }

  return envVars;
};
