import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

let bot = null;

if (token && chatId) {
  bot = new TelegramBot(token, { polling: false });
} else {
  console.warn("Telegram bot token or chat ID is missing in environment variables.");
}

export const sendTelegramNotification = async (visitorName, visitorEmail, message) => {
  if (!bot || !chatId) return;

  const text = `
📩 *New Portfolio Chat*

👤 *Name:* ${visitorName}
📧 *Email:* ${visitorEmail}

💬 *Message:* ${message}

⏰ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })}

[Open Dashboard](http://localhost:5173/dashboard)
  `;

  try {
    await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
};
