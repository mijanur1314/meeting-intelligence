import 'dotenv/config';
import app from './app';
import { logger } from './utils/logger';
import { startScheduler } from './services/scheduler.service';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Connected to the database');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      startScheduler();
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
