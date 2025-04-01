export interface Configuration {
  clientId: string;
  clientSecret: string;
  projectKey: string;
  authUrl: string;
  apiUrl: string;
  sendgridApiKey: string;
  otlpExporterEndpoint?: string;
  otlpExporterEndpointApiKey?: string;
}
