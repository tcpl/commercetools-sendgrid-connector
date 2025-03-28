import { Request } from 'express';

import CustomError from '../errors/custom.error';

import { decodeToJson } from '../utils/decoder.utils';
import { readConfiguration } from '../utils/config.utils';

import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_ACCEPTED,
} from '../constants/http-status.constants';

import {
  NOTIFICATION_TYPE_RESOURCE_CREATED,
  VALID_CUSTOMER_MESSAGE_TYPES,
} from '../constants/constants';

export function isSelfCreatedChange(messageBody: any) {
  const resourceModifiedBy = messageBody.createdBy?.clientId;
  const currentConnectorClientId = readConfiguration().clientId;
  return resourceModifiedBy === currentConnectorClientId;
}

function isValidMessageType(messageBodyType: string) {
  //this will contain other resource types e.g. order created.
  return VALID_CUSTOMER_MESSAGE_TYPES.includes(messageBodyType);
}

function isCustomerSubscriptionMessage(messageBodyType: string) {
  return VALID_CUSTOMER_MESSAGE_TYPES.includes(messageBodyType);
}

export function doValidation(request: Request) {
  console.log('entered doValidation');

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

  // Make sure incoming message contains correct notification type
  if (NOTIFICATION_TYPE_RESOURCE_CREATED === messageBody.notificationType) {
    throw new CustomError(
      HTTP_STATUS_SUCCESS_ACCEPTED,
      `Incoming message is about subscription resource creation. Skip handling the message.`
    );
  }

  // Make sure incoming message contains a supported message type
  if (!isValidMessageType(messageBody.type)) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      `Message type ${messageBody.type} is not managed in this connector.`
    );
  }

  // Make sure incoming message contains the identifier of the changed resources
  const resourceTypeId = messageBody?.resource?.typeId;
  const resourceId = messageBody?.resource?.id;

  if (
    isCustomerSubscriptionMessage(messageBody.type) &&
    (resourceTypeId !== 'customer' || !resourceId)
  ) {
    throw new CustomError(
      HTTP_STATUS_BAD_REQUEST,
      ` No customer ID is found in message.`
    );
  }

  // Make sure incoming message is not created by the current connector
  if (isSelfCreatedChange(messageBody)) {
    throw new CustomError(
      HTTP_STATUS_SUCCESS_ACCEPTED,
      `Incoming message (ID=${messageBody.id}) is about change of ${messageBody.type} created by the current connector. Skip handling the message.`
    );
  }
}
