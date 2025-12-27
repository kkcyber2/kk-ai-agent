import express from 'express';
import { supabase } from '../utils/database';

const router = express.Router();

// Get user settings
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .order('platform');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings for a platform
router.put('/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        platform,
        ...updates,
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get notification settings
router.get('/notifications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json(data || {
      email_enabled: false,
      sms_enabled: false,
      email_address: '',
      phone_number: '',
      notify_on_new_message: true,
      notify_on_urgent: true,
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
});

// Update notification settings
router.put('/notifications', async (req, res) => {
  try {
    const updates = req.body;

    const { data, error } = await supabase
      .from('notification_settings')
      .upsert(updates)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
});

export { router as settingsRoutes };