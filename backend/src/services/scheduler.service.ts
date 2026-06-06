import cron from 'node-cron';
import { ReminderService } from './reminder.service';
import { logger } from '../utils/logger';

const reminderService = new ReminderService();

export const startScheduler = () => {
  cron.schedule('0 * * * *', async () => {
    logger.info('Running hourly overdue reminder job');
    try {
      await reminderService.processOverdueReminders();
    } catch (err) {
      logger.error('Scheduler encountered an error', err);
    }
  });

  logger.info('Reminder scheduler started');
};
