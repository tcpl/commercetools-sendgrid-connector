import express, { Express } from 'express';
import bodyParser from 'body-parser';

import { readConfiguration } from './utils/config.utils';
import { errorMiddleware } from './middleware/error.middleware';
import CustomError from './errors/custom.error';

import EventRoutes from './routes/event.route';

import * as dotenv from 'dotenv';
dotenv.config();

readConfiguration();

const app: Express = express();
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', EventRoutes);

app.use('*wildcard', () => {
  throw new CustomError(404, 'Path not found.');
});

app.use(errorMiddleware);

export default app;
