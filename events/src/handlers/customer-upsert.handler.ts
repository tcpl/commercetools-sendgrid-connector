import { ClientRequest } from '@sendgrid/client/src/request';
import { createApiRoot } from '../client/create.client';
import sendgridClient from '@sendgrid/client';
import { getLogger } from '../utils/logger.utils';
import winston from 'winston';

async function getCustomer(customerId: string) {
  const response = await createApiRoot()
    .customers()
    .withId({
      ID: customerId,
    })
    .get()
    .execute();

  return response.body;
}

async function sendRequest(msg: ClientRequest, logger: winston.Logger) {
  sendgridClient.setApiKey(process.env.SENDGRID_API_KEY!);
  sendgridClient.request(msg).catch((error) => {
    logger.error('Error sending request to SendGrid:', error);
    throw error;
  });
}

export async function handleCustomerUpsert(customerId: string) {
  const logger = getLogger();
  const ctCustomer = await getCustomer(customerId);

  if (!ctCustomer) {
    logger.error(`Customer with ID ${customerId} not found`);
    return;
  }

  const msg: ClientRequest = {
    method: 'PUT',
    url: `/v3/marketing/contacts`,
    body: {
      contacts: [
        {
          external_id: customerId,
          email: ctCustomer.email,
          first_name: ctCustomer.firstName,
          last_name: ctCustomer.lastName,
        },
      ],
    },
  };

  await sendRequest(msg, logger);
}
