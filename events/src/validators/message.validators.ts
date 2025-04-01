import { Request } from 'express';

import CustomError from '../errors/custom.error';

import { decodeToJson } from '../utils/decoder.utils';
import { readConfiguration } from '../utils/config.utils';

import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../types/constants/http-status.constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSelfCreatedChange(messageBody: any) {
  if (
    typeof messageBody !== 'object' ||
    messageBody === null ||
    !('createdBy' in messageBody)
  ) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: Invalid message body format - Missing createdBy property'
    );
  }
  const resourceModifiedBy = (
    messageBody as { createdBy: { clientId: string } }
  ).createdBy?.clientId;
  const currentConnectorClientId = readConfiguration().clientId;
  return resourceModifiedBy === currentConnectorClientId;
}

export async function validateMessageBody(request: Request) {
  if (!request.body) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: No Pub/Sub message was received'
    );
  }

  if (!request.body.message) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: Wrong No Pub/Sub message format - Missing body message'
    );
  }

  if (!request.body.message.data) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: Wrong No Pub/Sub message format - Missing data in body message'
    );
  }
  const encodedMessageBody = request.body.message.data;
  const messageBody = decodeToJson(encodedMessageBody);

  if (!messageBody) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      'Bad request: Wrong No Pub/Sub message format - Cannot decode message body'
    );
  }

  //Make sure incoming message is not created by the current connector
  if (isSelfCreatedChange(messageBody)) {
    throw new CustomError(
      HTTP_STATUS_SUCCESS_ACCEPTED,
      `Incoming message (ID=${messageBody.id}) is about change of ${messageBody.type} created by the current connector. Skip handling the message.`
    );
  }

  return messageBody;
}
