import express, { Express } from 'express';
import bodyParser from 'body-parser';

import { readConfiguration } from './utils/config.utils';
import { errorMiddleware } from './middleware/error.middleware';

import CustomError from './errors/custom.error';
import { validateMessageBody } from './validators/message.validators';

import * as dotenv from 'dotenv';
import { handleCustomerUpsert } from './handlers/customer-upsert.handler';

dotenv.config();

readConfiguration();

const app: Express = express();
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('*wildcard', () => {
  throw new CustomError(404, 'Path not found.');
});

app.use(errorMiddleware);

app.post('/', async (req, res) => {
  const messageBody = await validateMessageBody(req);
  const resourceType = messageBody.resource.typeId;

  const notificationType = messageBody.notificationType;

  const resourceId = messageBody.resource.id;

  if (resourceType === 'customer') {
    switch (notificationType) {
      case 'ResourceCreated':
      case 'ResourceUpdated':
        await handleCustomerUpsert(resourceId);
        break;
    }
  } else {
    throw new CustomError(
      500,
      `Message type ${messageBody.type} is not managed in this connector.`
    );
  }

  res.status(204).send();
});

export default app;
