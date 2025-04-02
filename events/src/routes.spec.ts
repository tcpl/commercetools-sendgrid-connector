import { expect } from '@jest/globals';
import request from 'supertest';
import app from './app';
import { readConfiguration } from './utils/config.utils';
import { handleCustomerUpsert } from './handlers/customer-upsert.handler';

jest.mock('./utils/config.utils');
jest.mock('./handlers/customer-upsert.handler', () => ({
  handleCustomerUpsert: jest.fn(),
}));

describe('Testing router', () => {
  beforeEach(() => {
    (readConfiguration as jest.Mock).mockClear();
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

  test('valid body', async () => {
    const response = await request(app)
      .post('/')
      .send({
        message: {
          data: 'eyJ0eXBlSWQiOiJjdXN0b21lciIsIm5vdGlmaWNhdGlvblR5cGUiOiJSZXNvdXJlQ3JlYXRlZCIsInJlc291cmNlIjp7ImlkIjoiY3VzdG9tZXItMTIzIn19',
        },
      });
    expect(response.status).toBe(204);
  });

  test('Post body with unsupported resource type', async () => {
    const response = await request(app)
      .post('/')
      .send({
        message: {
          data: 'eyJ0eXBlSWQiOiJub25zdHJ1Y3QiLCJub3RpZmljYXRpb25UeXBlIjoiUmVzb3VyY2VDcmVhdGVkIiwicmVzb3VyY2UiOnsiZGF0YSI6eyJ0eXBlSWQiOiJjdXN0b21lciIsInNjaGVtYSI6InVzZXIiLCJ1c2VyIjoiY3VzdG9tZXItMTIzIn19fQ==',
        },
      });
    expect(response.status).toBe(204);
  });

  test('Post body with supported notification type', async () => {
    (handleCustomerUpsert as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/')
      .send({
        message: {
          data: Buffer.from(
            JSON.stringify({
              resource: {
                typeId: 'customer',
                id: 'customer-123',
              },
              notificationType: 'ResourceUpdated',
            })
          ).toString('base64'),
        },
      })
      .expect(204);

    expect(response.status).toBe(204);
    // expect(handleCustomerUpsert).toHaveBeenCalled();
    expect(handleCustomerUpsert).toHaveBeenCalledWith('customer-123');
  });

  test('Post body with unsupported notification type', async () => {
    (handleCustomerUpsert as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/')
      .send({
        message: {
          data: Buffer.from(
            JSON.stringify({
              resource: {
                typeId: 'customer',
                id: 'customer-123',
              },
              notificationType: 'ResourceDeleted',
            })
          ).toString('base64'),
        },
      })
      .expect(204);

    expect(response.status).toBe(204);
    expect(handleCustomerUpsert).not.toHaveBeenCalledWith();
  });
});
