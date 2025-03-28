import GenericHandler from './generic-handler';

class CustomerUpdatedHandler extends GenericHandler {
  constructor() {
    super();
  }

  async proccess(messageBody: any) {
    this.logger.info('Customer updated');
    this.logger.info(messageBody);
    console.dir(messageBody, { depth: 10 });

    // these should probably need the customer extracted from the message body first
    const contact = {
      external_id: messageBody.id,
      email: messageBody.email,
      first_name: messageBody.first_name,
      last_name: messageBody.last_name,
    };

    const sgContactUpdateRequest = {
      method: 'PUT',
      url: `/v3/marketing/contacts`,
      body: {
        contacts: [contact],
      },
    };

    this.sendRequest(sgContactUpdateRequest);
  }
}

export default CustomerUpdatedHandler;
