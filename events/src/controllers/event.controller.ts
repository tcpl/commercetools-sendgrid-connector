import { Request, Response } from 'express';
//import { createApiRoot } from '../client/create.client';

import HandlerFactory from '../factory/handler.factory';

import { decodeToJson } from '../utils/decoder.utils';
import { getLogger } from '../utils/logger.utils';
import { doValidation } from '../validators/message.validators';
import { HTTP_STATUS_SUCCESS_ACCEPTED } from '../constants/http-status.constants';

const logger = getLogger();

export const messageHandler = async (request: Request, response: Response) => {
  // Send ACCEPTED acknowledgement to Subscription
  response.status(HTTP_STATUS_SUCCESS_ACCEPTED).send();

  const encodedMessageBody = request.body.message.data;
  const messageBody = decodeToJson(encodedMessageBody);
  console.log('messageBody', messageBody);

  doValidation(request);

  const handlerFactory = new HandlerFactory(messageBody.type);
  const handler = handlerFactory.getHandler();
  console.log('handler', handler);
  console.log('messageBody', messageBody);
  handler.proccess(messageBody);

  // let customerId = undefined;

  // if (!customerId) {
  //   throw new CustomError(
  //     400,
  //     'Bad request: No customer id in the Pub/Sub message'
  //   );
  // }

  // try {
  //   const customer = await createApiRoot()
  //     .customers()
  //     .withId({ ID: Buffer.from(customerId).toString() })
  //     .get()
  //     .execute();

  //   // Execute the tasks in need
  //   logger.info(customer);
  // } catch (error) {
  //   throw new CustomError(400, `Bad request: ${error}`);
  // }

  // // Return the response for the client
  // response.status(204).send();
};
