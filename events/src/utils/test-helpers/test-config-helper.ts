import { Configuration } from '../../types/config.interface';

export const getConfig = (): Configuration => {
  return {
    clientId: '012345678901234567890123', // 24 characters
    clientSecret: '01234567890123456789012345678901', // 32 characters
    projectKey: 'test-project-key',
    authUrl: 'https://auth.example.com',
    apiUrl: 'https://api.example.com',
    sendgridApiKey: '0123456789012345678', // more than 4 characters
  };
};
