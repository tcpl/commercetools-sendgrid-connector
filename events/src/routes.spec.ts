import { expect } from '@jest/globals';
import request from 'supertest';
import app from './app';
import { readConfiguration } from './utils/config.utils';

jest.mock('./utils/config.utils');
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
});
