import { createApiRoot } from '../client/create.client';
import sendgridClient from '@sendgrid/client';
import { getLogger } from '../utils/logger.utils';

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

async function sendRequest(msg: any) {
  sendgridClient.setApiKey(process.env.SENDGRID_API_KEY!);
  sendgridClient.request(msg);
}

export async function handleCustomerUpsert(customerId: string) {
  const logger = getLogger();

  const ctCustomer = await getCustomer(customerId);

  const msg = {
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

  await sendRequest(msg);
}
