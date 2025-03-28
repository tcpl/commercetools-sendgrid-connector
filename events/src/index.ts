import * as dotenv from 'dotenv';
dotenv.config();

import { getLogger } from './utils/logger.utils';

import app from './app';

const PORT = 8080;
const logger = getLogger();
// Listen the application
const server = app.listen(PORT, () => {
  logger.info(`⚡️ Event application listening on port ${PORT}`);
});

export default server;
