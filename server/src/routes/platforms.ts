import express from 'express';
import { supabase } from '../utils/database';

const router = express.Router();

// Get connected accounts
router.get('/accounts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Add new account
router.post('/accounts', async (req, res) => {
  try {
    const { platform, account_id, account_name, access_token, refresh_token } = req.body;

    const { data, error } = await supabase
      .from('social_accounts')
      .insert({
        platform,
        account_id,
        account_name,
        access_token,
        refresh_token,
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Add account error:', error);
    res.status(500).json({ error: 'Failed to add account' });
  }
});

// Update account
router.put('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('social_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// Delete account
router.delete('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Test account connection
router.post('/accounts/:id/test', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: account, error: accountError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (accountError) throw accountError;

    // Test connection based on platform
    let testResult = false;

    switch (account.platform) {
      case 'instagram':
        // Test Instagram API
        try {
          const response = await fetch(`https://graph.instagram.com/me?access_token=${account.access_token}`);
          testResult = response.ok;
        } catch (error) {
          testResult = false;
        }
        break;
      case 'facebook':
        // Test Facebook API
        try {
          const response = await fetch(`https://graph.facebook.com/me?access_token=${account.access_token}`);
          testResult = response.ok;
        } catch (error) {
          testResult = false;
        }
        break;
      case 'whatsapp':
        // Test WhatsApp API
        try {
          const response = await fetch(`https://graph.facebook.com/v18.0/${account.account_id}?access_token=${account.access_token}`);
          testResult = response.ok;
        } catch (error) {
          testResult = false;
        }
        break;
      case 'linkedin':
        // Test LinkedIn API
        try {
          const response = await fetch('https://api.linkedin.com/v2/people/~', {
            headers: { 'Authorization': `Bearer ${account.access_token}` }
          });
          testResult = response.ok;
        } catch (error) {
          testResult = false;
        }
        break;
      default:
        testResult = false;
    }

    res.json({ success: testResult });
  } catch (error) {
    console.error('Test account error:', error);
    res.status(500).json({ error: 'Failed to test account' });
  }
});

export { router as platformRoutes };