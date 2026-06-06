import { prisma } from '../lib/prisma';
import { TelegramService } from './telegram.service';
import { logger } from '../utils/logger';

const telegramService = new TelegramService();

export class ReminderService {
  async processOverdueReminders() {
    const now = new Date();

    const overdueItems = await prisma.actionItem.findMany({
      where: {
        status: { not: 'COMPLETED' },
        dueDate: { lt: now }
      },
      include: {
        assignee: true,
        reminders: true
      }
    });

    for (const item of overdueItems) {
      // Prevent duplicate reminders within 24 hours
      const lastReminder = item.reminders.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())[0];
      if (lastReminder && (now.getTime() - lastReminder.sentAt.getTime() < 24 * 60 * 60 * 1000)) {
        continue;
      }

      const assigneeName = item.assigneeName || item.assignee?.email || 'Unassigned';

      try {
        await telegramService.sendReminder(item.task, assigneeName, item.dueDate!);
        
        await prisma.reminderHistory.create({
          data: {
            actionItemId: item.id,
            status: 'SUCCESS',
            sentAt: new Date()
          }
        });
      } catch (error: any) {
        await prisma.reminderHistory.create({
          data: {
            actionItemId: item.id,
            status: 'FAILED',
            errorMessage: error.message,
            sentAt: new Date()
          }
        });
      }
    }
  }
}
