import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { handleCustomerUpsert } from './customer-upsert.handler';
import sendgridClient from '@sendgrid/client';
import { createApiRoot } from '../client/create.client';

// Mock dependencies
jest.mock('@sendgrid/client', () => ({
  setApiKey: jest.fn(),
  request: jest.fn(),
}));

jest.mock('../client/create.client');

describe('handleCustomerUpsert', () => {
  const mockCustomerId = 'test-customer-123';
  const mockCustomerData = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock createApiRoot implementation
    (createApiRoot as jest.Mock).mockReturnValue({
      customers: () => ({
        withId: () => ({
          get: () => ({
            execute: () => Promise.resolve({ body: mockCustomerData }),
          }),
        }),
      }),
    });
  });

  test('should fetch customer and send correct data to SendGrid', async () => {
    await handleCustomerUpsert(mockCustomerId);

    // Verify SendGrid client was initialized
    expect(sendgridClient.setApiKey).toHaveBeenCalled();

    // Verify the request was made with correct data
    expect(sendgridClient.request).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        contacts: [
          {
            external_id: mockCustomerId,
            email: mockCustomerData.email,
            first_name: mockCustomerData.firstName,
            last_name: mockCustomerData.lastName,
          },
        ],
      },
    });
  });

  test('should throw error if customer fetch fails', async () => {
    // Mock createApiRoot to throw error
    (createApiRoot as jest.Mock).mockReturnValue({
      customers: () => ({
        withId: () => ({
          get: () => ({
            execute: () =>
              Promise.reject(new Error('Failed to fetch customer')),
          }),
        }),
      }),
    });

    await expect(handleCustomerUpsert(mockCustomerId)).rejects.toThrow(
      'Failed to fetch customer'
    );
  });
});
