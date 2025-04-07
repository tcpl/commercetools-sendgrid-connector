import { createApplicationLogger } from '@commercetools-backend/loggers';
import winston from 'winston';
import { logs } from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { readConfiguration } from '../utils/config.utils';

let loggerInstance: winston.Logger | undefined = undefined;

export const getLogger = (useBatchLogRecordProcessor: boolean = true) => {
  if (!loggerInstance) {
    loggerInstance = createApplicationLogger({
      level: process.env.LOG_LEVEL || 'info',
    });

    const configuration = readConfiguration();

    if (
      configuration.otlpExporterEndpoint &&
      configuration.otlpExporterEndpointApiKey
    ) {
      const loggerProvider = new LoggerProvider({
        resource: resourceFromAttributes({
          ['service.name']: `dovetech-sendgrid-connector:${configuration.projectKey}`,
        }),
      });
      const logExporter = new OTLPLogExporter({
        url: `${configuration.otlpExporterEndpoint}/v1/logs`,
        headers: {
          'api-key': configuration.otlpExporterEndpointApiKey,
        },
      });
      loggerProvider.addLogRecordProcessor(
        useBatchLogRecordProcessor
          ? new BatchLogRecordProcessor(logExporter)
          : new SimpleLogRecordProcessor(logExporter)
      );

      logs.setGlobalLoggerProvider(loggerProvider);
      loggerInstance.add(new OpenTelemetryTransportV3());
    }
  }

  return loggerInstance;
};
