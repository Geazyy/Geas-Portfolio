import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("Supabase credentials are not set in the environment variables.");
}

export const saveChatSession = async (visitorName, visitorEmail, sessionId) => {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('chats')
      .upsert([
        { session_id: sessionId, visitor_name: visitorName, visitor_email: visitorEmail }
      ], { onConflict: 'session_id' })
      .select()
      .single();
      
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error saving chat session to Supabase:", error);
    return null;
  }
};

export const saveChatMessage = async (chatId, sender, messageText) => {
  if (!supabase || !chatId) return null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { chat_id: chatId, sender, message: messageText }
      ]);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving chat message to Supabase:", error);
    return null;
  }
};

export const getAllChats = async () => {
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        messages (
          id, sender, message, created_at, read_status
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching chats from Supabase:", error);
    return [];
  }
};
