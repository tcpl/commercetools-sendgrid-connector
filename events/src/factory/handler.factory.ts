import CustomerCreatedHandler from '../handlers/customer-created.handler';
import CustomerUpdatedHandler from '../handlers/customer-updated.handler';

class HandlerFactory {
  constructor(private messageType: string) {
    this.messageType = messageType;
  }

  getHandler() {
    switch (this.messageType) {
      case 'CustomerCreated':
        return new CustomerCreatedHandler();
      case 'CustomerUpdated':
        return new CustomerUpdatedHandler();

      default:
        throw new Error('Handler not found');
    }
  }
}

export default HandlerFactory;
