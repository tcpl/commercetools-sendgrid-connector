import express, { Express } from 'express';
import bodyParser from 'body-parser';

import { readConfiguration } from './utils/config.utils';
import { validateMessageBody } from './validators/message.validators';
import { handleCustomerUpsert } from './handlers/customer-upsert.handler';

import dotenv from 'dotenv';
dotenv.config();

readConfiguration();

const app: Express = express();
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    console.log(`Resource type: ${resourceType} not supported`);
  }

  app.use('/*wildcard', () => {
    res.status(404).send();
  });

  res.status(204).send();
});

export default app;
