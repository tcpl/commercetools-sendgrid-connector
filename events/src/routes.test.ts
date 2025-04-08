import { expect } from '@jest/globals';
import request from 'supertest';
import app from './app';
import { readConfiguration } from './utils/config.utils';
import { handleCustomerUpsert } from './handlers/customer-upsert.handler';
import { getTestMessage } from './utils/test-helpers/message-helpers';

jest.mock('./utils/config.utils');
jest.mock('./handlers/customer-upsert.handler', () => ({
  handleCustomerUpsert: jest.fn(),
}));

describe('Testing router', () => {
  beforeEach(() => {
    (readConfiguration as jest.Mock).mockClear();
    (handleCustomerUpsert as jest.Mock).mockResolvedValue(undefined);
  });

  test('Post to non existing route', async () => {
    const response = await request(app).post('/none');
    expect(response.status).toBe(404);
  });

  test('Post invalid body', async () => {
    const response = await request(app).post('/').send({
      message: 'hello world',
    });
    expect(response.status).toBe(400);
  });

  test('Post empty body', async () => {
    const response = await request(app).post('/');
    expect(response.status).toBe(400);
  });

  test('Post empty body message', async () => {
    const response = await request(app).post('/').send({});
    expect(response.status).toBe(400);
  });

  test('Post body with missing data', async () => {
    const response = await request(app)
      .post('/')
      .send({
        message: {
          data: null,
        },
      });
    expect(response.status).toBe(400);
  });

  test('Post body with unsupported resource type', async () => {
    await request(app)
      .post('/')
      .send(
        getTestMessage({
          resource: {
            typeId: 'order',
            id: 'order-123',
          },
          notificationType: 'ResourceCreated',
        })
      )
      .expect(204);
    expect(handleCustomerUpsert).not.toHaveBeenCalled();
  });

  test('Post body with supported notification type', async () => {
    await request(app)
      .post('/')
      .send(
        getTestMessage({
          resource: {
            typeId: 'customer',
            id: 'updated-customer-123',
          },
          notificationType: 'ResourceUpdated',
        })
      )
      .expect(204);

    expect(handleCustomerUpsert).toHaveBeenCalledWith('updated-customer-123');
  });

  test('Post body with unsupported notification type', async () => {
    (handleCustomerUpsert as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .post('/')
      .send(
        getTestMessage({
          resource: {
            typeId: 'customer',
            id: 'customer-123',
          },
          notificationType: 'ResourceDeleted',
        })
      )
      .expect(204);

    expect(handleCustomerUpsert).not.toHaveBeenCalledWith();
  });
});
