import app from './app';
import { getLogger } from './utils/logger.utils';

const PORT = 8080;

const server = app.listen(PORT, () => {
  const logger = getLogger();
  logger.info(`⚡️ Event application listening on port ${PORT}`);
});
