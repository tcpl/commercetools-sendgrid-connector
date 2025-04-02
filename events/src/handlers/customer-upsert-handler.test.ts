import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { handleCustomerUpsert } from './customer-upsert.handler';
import sendgridClient from '@sendgrid/client';
import { createApiRoot } from '../client/create.client';

jest.mock('@sendgrid/client');
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
    (sendgridClient.setApiKey as jest.Mock).mockImplementation(() => {});
    (sendgridClient.request as jest.Mock).mockImplementation(async () => {});

    await handleCustomerUpsert(mockCustomerId);
    expect(createApiRoot).toHaveBeenCalled();

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
    const error = new Error('Failed to fetch customer');
    // Mock createApiRoot to throw error
    (createApiRoot as jest.Mock).mockReturnValue({
      customers: () => ({
        withId: () => ({
          get: () => ({
            execute: () => Promise.reject(error),
          }),
        }),
      }),
    });

    await expect(handleCustomerUpsert(mockCustomerId)).rejects.toThrow(error);
  });

  test('should handle case when customer is not found', async () => {
    // Mock createApiRoot to return null
    (createApiRoot as jest.Mock).mockReturnValue({
      customers: () => ({
        withId: () => ({
          get: () => ({
            execute: () => Promise.resolve({}),
          }),
        }),
      }),
    });

    await handleCustomerUpsert(mockCustomerId);
    expect(sendgridClient.request).not.toHaveBeenCalled();
  });

  test('should throw error if sendgrid request fails', async () => {
    const sendgridError = new Error('SendGrid API error');

    (sendgridClient.setApiKey as jest.Mock).mockImplementation(async () => {});
    (sendgridClient.request as jest.Mock).mockReturnValue(async () =>
      Promise.reject(sendgridError)
    );

    await handleCustomerUpsert(mockCustomerId).catch((error) => {
      expect(error).toEqual(sendgridError);
    });
  });
});
