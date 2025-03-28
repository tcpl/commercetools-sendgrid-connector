import GenericHandler from './generic-handler';

class CustomerCreatedHandler extends GenericHandler {
  constructor() {
    super();
  }

  async proccess(messageBody: any) {
    this.logger.info('Customer updated');
    this.logger.info(messageBody);
    console.dir(messageBody, { depth: 10 });
  }
}

export default CustomerCreatedHandler;
