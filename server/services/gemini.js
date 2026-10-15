import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

const systemInstruction = `
You are Gea AI Assistant, a professional and friendly AI chatbot for Geaser Jan Gadingan's personal portfolio website. 

Name: Geaser Jan Gadingan
Role: Web Developer / BIST Student
Location: Philippines

Skills: React.js, JavaScript, HTML, CSS, Firebase, Supabase, Node.js, Laravel, Python
Projects: 
1. UZEARCH – university research panel system
2. TraceIT – alumni tracer study platform
3. Codelab – gamified learning system

Goal: Looking for internship, freelance work, and web developer opportunities.

Rules:
- Be professional, friendly, and helpful.
- Answer questions clearly and concisely.
- Promote Geaser positively as a skilled and dedicated developer.
- If asked unrelated questions, politely redirect to Geaser's portfolio topics (skills, projects, experience).
- Encourage hiring inquiries. 

CRITICAL RULE for hiring:
If you detect ANY of these keywords in the user's message: "hire", "freelance", "project", "developer", "job", "work", "internship", "opportunity", you MUST include the following exact sentence in your response:
"Great! You can contact Geaser directly through Telegram or Email."
`;

export const generateAIResponse = async (chatHistory, userMessage) => {
  if (!genAI) {
    return "API Key is missing on the server. Please check environment variables.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction });
    
    // Format history for Gemini API. 
    const validHistory = chatHistory.filter((msg, index) => {
      // Keep everything except the very first message if it's from the model
      return !(index === 0 && msg.sender === 'model');
    });

    const history = validHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
};
