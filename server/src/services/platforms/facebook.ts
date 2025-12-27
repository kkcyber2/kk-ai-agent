import axios from 'axios';
import { supabase } from '../../utils/database';
import { analyzeMessage } from '../aiService';

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';

export const checkFacebookMessages = async () => {
  try {
    const { data: accounts } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('platform', 'facebook');

    for (const account of accounts) {
      const response = await axios.get(`${FACEBOOK_API_BASE}/me/conversations`, {
        params: {
          access_token: account.access_token,
          fields: 'id,participants,messages{id,message,from,to,created_time}',
        },
      });

      const conversations = response.data.data;

      for (const conversation of conversations) {
        const latestMessage = conversation.messages.data[0];

        // Check if message is already processed
        const { data: existingMessage } = await supabase
          .from('messages')
          .select('id')
          .eq('message_id', latestMessage.id)
          .single();

        if (!existingMessage) {
          const sentiment = await analyzeMessage(latestMessage.message);

          await supabase.from('messages').insert({
            platform: 'facebook',
            account_id: account.account_id,
            message_id: latestMessage.id,
            sender_id: latestMessage.from.id,
            sender_name: latestMessage.from.name,
            content: latestMessage.message,
            sentiment,
            status: 'pending',
          });

          // Log interaction
          await supabase.from('interaction_logs').insert({
            platform: 'facebook',
            action: 'message_received',
            details: { message_id: latestMessage.id, sender: latestMessage.from.name },
          });
        }
      }
    }
  } catch (error) {
    console.error('Facebook monitoring error:', error);
  }
};

export const sendFacebookMessage = async (
  accountId: string,
  recipientId: string,
  message: string
) => {
  try {
    const { data: account } = await supabase
      .from('social_accounts')
      .select('access_token')
      .eq('account_id', accountId)
      .single();

    await axios.post(`${FACEBOOK_API_BASE}/me/messages`, {
      recipient: { id: recipientId },
      message: { text: message },
      access_token: account.access_token,
    });

    // Log interaction
    await supabase.from('interaction_logs').insert({
      platform: 'facebook',
      action: 'message_sent',
      details: { recipient_id: recipientId, message_length: message.length },
    });
  } catch (error) {
    console.error('Facebook send message error:', error);
    throw error;
  }
};