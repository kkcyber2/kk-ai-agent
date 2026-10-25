import axios from 'axios';
import { getSupabase } from '../../utils/database';
import { analyzeMessage } from '../aiService';

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

export const checkInstagramMessages = async () => {
  try {
    const { data: accounts } = await getSupabase()
      .from('social_accounts')
      .select('*')
      .eq('platform', 'instagram');

    for (const account of accounts ?? []) {
      const response = await axios.get(`${INSTAGRAM_API_BASE}/me/conversations`, {
        params: {
          access_token: account?.access_token,
          fields: 'id,participants,messages{id,message,from,to,created_time}',
        },
      });

      const conversations = response.data.data;

      for (const conversation of conversations ?? []) {
        const latestMessage = conversation.messages.data[0];

        // Check if message is already processed
        const { data: existingMessage } = await getSupabase()
          .from('messages')
          .select('id')
          .eq('message_id', latestMessage.id)
          .single();

        if (!existingMessage) {
          const sentiment = await analyzeMessage(latestMessage.message.text);

          await getSupabase().from('messages').insert({
            platform: 'instagram',
            account_id: account?.account_id,
            message_id: latestMessage.id,
            sender_id: latestMessage.from.id,
            sender_name: latestMessage.from.username,
            content: latestMessage.message.text,
            sentiment,
            status: 'pending',
          });

          // Log interaction
          await getSupabase().from('interaction_logs').insert({
            platform: 'instagram',
            action: 'message_received',
            details: { message_id: latestMessage.id, sender: latestMessage.from.username },
          });
        }
      }
    }
  } catch (error) {
    console.error('Instagram monitoring error:', error);
  }
};

export const sendInstagramMessage = async (
  accountId: string,
  recipientId: string,
  message: string
) => {
  try {
    const { data: account } = await getSupabase()
      .from('social_accounts')
      .select('access_token')
      .eq('account_id', accountId)
      .single();

    await axios.post(`${INSTAGRAM_API_BASE}/me/messages`, {
      recipient: { id: recipientId },
      message: { text: message },
      access_token: account?.access_token,
    });

    // Log interaction
    await getSupabase().from('interaction_logs').insert({
      platform: 'instagram',
      action: 'message_sent',
      details: { recipient_id: recipientId, message_length: message.length },
    });
  } catch (error) {
    console.error('Instagram send message error:', error);
    throw error;
  }
};