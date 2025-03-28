import { Router } from 'express';

import { getLogger } from '../utils/logger.utils';
import { messageHandler } from '../controllers/event.controller';
import { decodeToJson } from '../utils/decoder.utils';

const eventRouter: Router = Router();
const logger = getLogger();

eventRouter.post('/', async (req, res, next) => {
  logger.info('Event message received');

  const encodedMessageBody = req.body.message.data;
  const messageBody = decodeToJson(encodedMessageBody);
  console.log('messageBody', messageBody);

  try {
    await messageHandler(req, res);
  } catch (error) {
    next(error);
  }
});

export default eventRouter;
