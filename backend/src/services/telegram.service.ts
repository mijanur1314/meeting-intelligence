import TelegramBot from 'node-telegram-bot-api';
import { logger } from '../utils/logger';

export class TelegramService {
  async sendReminder(task: string, assigneeName: string, dueDate: Date) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      throw new Error('Telegram bot token or chat ID is not configured');
    }

    const bot = new TelegramBot(token, { polling: false });
    const formattedDate = dueDate.toLocaleDateString();
    const message = `Reminder\n\nTask: ${task}\nAssigned To: ${assigneeName}\nDue Date: ${formattedDate}`;

    try {
      await bot.sendMessage(chatId, message);
      logger.info('Telegram reminder sent', { task, assigneeName });
      return true;
    } catch (error: any) {
      logger.error('Failed to send Telegram reminder', { error: error.message });
      throw new Error(`Telegram API Error: ${error.message}`);
    }
  }
}
