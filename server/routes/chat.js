import express from 'express';
import { generateAIResponse } from '../services/gemini.js';
import { saveChatSession, saveChatMessage, getAllChats } from '../services/supabase.js';
import { sendTelegramNotification } from '../services/telegram.js';
import { sendEmailNotification } from '../services/email.js';

const QUICK_ACTIONS = [
  "About Me",
  "Skills",
  "Projects",
  "Certificates",
  "Hire Me",
  "Contact"
];

const router = express.Router();

// Get all chats (for Dashboard)
router.get('/', async (req, res) => {
  try {
    const chats = await getAllChats();
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chats' });
  }
});

// Handle incoming chat messages
router.post('/', async (req, res) => {
  const { visitorName, visitorEmail, sessionId, message, history } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    // 1. Save or get the Chat Session in Supabase
    let chatId = null;
    if (visitorName && visitorEmail && sessionId) {
       chatId = await saveChatSession(visitorName, visitorEmail, sessionId);
    }

    // 2. Save User Message to Supabase
    if (chatId) {
      await saveChatMessage(chatId, 'user', message);
    }

    // 3. Send Telegram & Email Notifications (Run asynchronously)
    if (visitorName && visitorEmail && !QUICK_ACTIONS.includes(message)) {
      sendTelegramNotification(visitorName, visitorEmail, message).catch(console.error);
      sendEmailNotification(visitorName, visitorEmail, message).catch(console.error);
    }

    // 4. Get Gemini AI Response
    const aiResponseText = await generateAIResponse(history || [], message);

    // 5. Save AI Message to Supabase
    if (chatId) {
      await saveChatMessage(chatId, 'model', aiResponseText);
    }

    // 6. Return response to frontend
    res.json({
      success: true,
      reply: aiResponseText
    });

  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a chat session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    
    const { error } = await supabase.from('chats').delete().eq('id', id);
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete chat' });
  }
});

// Mark messages as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    
    const { error } = await supabase
      .from('messages')
      .update({ read_status: true })
      .eq('chat_id', id);
      
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
});

// Manual Admin Reply
router.post('/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, visitorEmail } = req.body;
    
    // Save to DB as 'model' or 'admin'
    await saveChatMessage(id, 'model', message);
    
    // Send email to visitor
    if (visitorEmail) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      
      await transporter.sendMail({
        from: `"Geaser Jan Gadingan" <${process.env.EMAIL_USER}>`,
        to: visitorEmail,
        subject: `Reply to your chat on Geaser's Portfolio`,
        text: message
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send reply' });
  }
});

export default router;
