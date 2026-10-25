import axios from 'axios';
import { getSupabase } from '../../utils/database';
import { analyzeMessage } from '../aiService';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

export const checkLinkedInMessages = async () => {
  try {
    const { data: accounts } = await getSupabase()
      .from('social_accounts')
      .select('*')
      .eq('platform', 'linkedin');

    for (const account of accounts ?? []) {
      const response = await axios.get(`${LINKEDIN_API_BASE}/messages`, {
        headers: {
          'Authorization': `Bearer ${account?.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
        params: {
          q: 'sender',
          sender: account?.account_id,
          count: 50,
        },
      });

      const messages = response.data.elements;

      for (const message of messages) {
        // Check if message is already processed
        const { data: existingMessage } = await getSupabase()
          .from('messages')
          .select('id')
          .eq('message_id', message.$URN)
          .single();

        if (!existingMessage) {
          const sentiment = await analyzeMessage(message.body);

          await getSupabase().from('messages').insert({
            platform: 'linkedin',
            account_id: account?.account_id,
            message_id: message.$URN,
            sender_id: message.sender,
            sender_name: message.sender,
            content: message.body,
            sentiment,
            status: 'pending',
          });

          // Log interaction
          await getSupabase().from('interaction_logs').insert({
            platform: 'linkedin',
            action: 'message_received',
            details: { message_id: message.$URN, sender: message.sender },
          });
        }
      }
    }
  } catch (error) {
    console.error('LinkedIn monitoring error:', error);
  }
};

export const sendLinkedInMessage = async (
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

    await axios.post(`${LINKEDIN_API_BASE}/messages`, {
      recipients: [recipientId],
      body: message,
    }, {
      headers: {
        'Authorization': `Bearer ${account?.access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    // Log interaction
    await getSupabase().from('interaction_logs').insert({
      platform: 'linkedin',
      action: 'message_sent',
      details: { recipient_id: recipientId, message_length: message.length },
    });
  } catch (error) {
    console.error('LinkedIn send message error:', error);
    throw error;
  }
};