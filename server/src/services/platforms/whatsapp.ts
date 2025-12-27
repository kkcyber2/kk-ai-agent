import axios from 'axios';
import { supabase } from '../../utils/database';
import { analyzeMessage } from '../aiService';

const WHATSAPP_API_BASE = 'https://graph.facebook.com/v18.0';

export const checkWhatsAppMessages = async () => {
  try {
    const { data: accounts } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('platform', 'whatsapp');

    for (const account of accounts) {
      const response = await axios.get(`${WHATSAPP_API_BASE}/${account.account_id}/messages`, {
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
        },
        params: {
          after: account.last_message_id || undefined,
        },
      });

      const messages = response.data.data;

      for (const message of messages) {
        if (message.type === 'text') {
          // Check if message is already processed
          const { data: existingMessage } = await supabase
            .from('messages')
            .select('id')
            .eq('message_id', message.id)
            .single();

          if (!existingMessage) {
            const sentiment = await analyzeMessage(message.text.body);

            await supabase.from('messages').insert({
              platform: 'whatsapp',
              account_id: account.account_id,
              message_id: message.id,
              sender_id: message.from,
              sender_name: message.from,
              content: message.text.body,
              sentiment,
              status: 'pending',
            });

            // Update last message ID
            await supabase
              .from('social_accounts')
              .update({ last_message_id: message.id })
              .eq('account_id', account.account_id);

            // Log interaction
            await supabase.from('interaction_logs').insert({
              platform: 'whatsapp',
              action: 'message_received',
              details: { message_id: message.id, sender: message.from },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('WhatsApp monitoring error:', error);
  }
};

export const sendWhatsAppMessage = async (
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

    await axios.post(`${WHATSAPP_API_BASE}/${account.account_id}/messages`, {
      messaging_product: 'whatsapp',
      to: recipientId,
      type: 'text',
      text: { body: message },
    }, {
      headers: {
        'Authorization': `Bearer ${account.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    // Log interaction
    await supabase.from('interaction_logs').insert({
      platform: 'whatsapp',
      action: 'message_sent',
      details: { recipient_id: recipientId, message_length: message.length },
    });
  } catch (error) {
    console.error('WhatsApp send message error:', error);
    throw error;
  }
};