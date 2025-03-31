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

    // const request: ClientRequest = {
    //     method: "PUT",
    //     url: "/v3/marketing/contacts",
    //     body: {
    //       contacts: [
    //         {
    //           address_line_1: "address_line_1",
    //           address_line_2: "address_line_2",
    //           city: "city",
    //           country: "country",
    //           email: "brian12@example.net",
    //           phone_number_id: "phone_number_id",
    //           external_id: "external_id",
    //           anonymous_id: "anonymous_id",
    //           first_name: "first_name",
    //           last_name: "last_name",
    //           postal_code: "postal_code",
    //           state_province_region: "state_province_region",
    //         },
    //       ],
    //     },
    //   };

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
