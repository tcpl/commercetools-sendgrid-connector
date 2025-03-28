import CustomError from '../errors/custom.error.js';
import { HTTP_STATUS_SERVER_ERROR } from '../constants/http-status.constants.js';

import sendgridEmailClient from '@sendgrid/mail';
import sendgridClient from '@sendgrid/client';
import { getLogger } from '../utils/logger.utils';

class GenericHandler {
  logger: any;

  constructor() {
    sendgridClient.setApiKey(process.env.SENDGRID_API_KEY!);
    sendgridEmailClient.setApiKey(process.env.SENDGRID_API_KEY!);
    this.logger = getLogger();
  }

  async sendMail(msg: any) {
    sendgridEmailClient
      .send(msg)
      .then((response: any) => {
        this.logger.info(response);
        this.logger.info('Email sent');
      })
      .catch((error: any) => {
        this.logger.error(error);
      });
  }

  async sendRequest(msg: any) {
    sendgridClient
      .request(msg)
      .then((response: any) => {
        this.logger.info(response);
        this.logger.info('Request sent');
      })
      .catch((error: any) => {
        this.logger.error(error);
      });
  }

  proccess(messageBody: any) {
    // Write the actual implementation in inherited handlers
    throw new CustomError(
      HTTP_STATUS_SERVER_ERROR,
      `Missing actual implementation in message handler`
    );
  }
}

export default GenericHandler;
