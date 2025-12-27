import express from 'express';
import { supabase } from '../utils/database';
import { generateResponse, shouldAutoApprove } from '../services/aiService';
import { sendInstagramMessage } from '../services/platforms/instagram';
import { sendFacebookMessage } from '../services/platforms/facebook';
import { sendWhatsAppMessage } from '../services/platforms/whatsapp';
import { sendLinkedInMessage } from '../services/platforms/linkedin';
import { sendTwitterMessage } from '../services/platforms/twitter';

const router = express.Router();

// Get messages with filtering
router.get('/', async (req, res) => {
  try {
    const { platform, status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (platform) {
      query = query.eq('platform', platform);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Generate AI response for a message
router.post('/:id/generate-response', async (req, res) => {
  try {
    const { id } = req.params;
    const { context } = req.body;

    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (messageError) throw messageError;

    const response = await generateResponse(message.content, message.platform, context);

    // Update message with generated response
    await supabase
      .from('messages')
      .update({
        generated_response: response,
        status: 'pending_approval',
      })
      .eq('id', id);

    res.json({ response });
  } catch (error) {
    console.error('Generate response error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Approve and send response
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { customResponse } = req.body;

    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (messageError) throw messageError;

    const responseToSend = customResponse || message.generated_response;

    // Send message based on platform
    switch (message.platform) {
      case 'instagram':
        await sendInstagramMessage(message.account_id, message.sender_id, responseToSend);
        break;
      case 'facebook':
        await sendFacebookMessage(message.account_id, message.sender_id, responseToSend);
        break;
      case 'whatsapp':
        await sendWhatsAppMessage(message.account_id, message.sender_id, responseToSend);
        break;
      case 'linkedin':
        await sendLinkedInMessage(message.account_id, message.sender_id, responseToSend);
        break;
      case 'twitter':
        await sendTwitterMessage(message.account_id, message.sender_id, responseToSend);
        break;
      default:
        throw new Error(`Unsupported platform: ${message.platform}`);
    }

    // Update message status
    await supabase
      .from('messages')
      .update({
        status: 'responded',
        sent_response: responseToSend,
        responded_at: new Date().toISOString(),
      })
      .eq('id', id);

    res.json({ success: true });
  } catch (error) {
    console.error('Approve response error:', error);
    res.status(500).json({ error: 'Failed to send response' });
  }
});

// Reject message
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    await supabase
      .from('messages')
      .update({ status: 'rejected' })
      .eq('id', id);

    res.json({ success: true });
  } catch (error) {
    console.error('Reject message error:', error);
    res.status(500).json({ error: 'Failed to reject message' });
  }
});

// Send proactive message
router.post('/send', async (req, res) => {
  try {
    const { platform, accountId, recipientId, message } = req.body;

    switch (platform) {
      case 'instagram':
        await sendInstagramMessage(accountId, recipientId, message);
        break;
      case 'facebook':
        await sendFacebookMessage(accountId, recipientId, message);
        break;
      case 'whatsapp':
        await sendWhatsAppMessage(accountId, recipientId, message);
        break;
      case 'linkedin':
        await sendLinkedInMessage(accountId, recipientId, message);
        break;
      case 'twitter':
        await sendTwitterMessage(accountId, recipientId, message);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Log proactive message
    await supabase.from('interaction_logs').insert({
      platform,
      action: 'message_sent_proactive',
      details: { recipient_id: recipientId, message_length: message.length },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Send proactive message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export { router as messageRoutes };