import express from 'express';
import axios from 'axios';

const router = express.Router();

// Instagram OAuth
router.get('/instagram/oauth', (req, res) => {
  const { INSTAGRAM_APP_ID, INSTAGRAM_REDIRECT_URI } = process.env;
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

router.get('/instagram/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, INSTAGRAM_REDIRECT_URI } = process.env;

    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      code,
    });

    const { access_token, user_id } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(`https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`);

    res.json({
      platform: 'instagram',
      account_id: user_id,
      account_name: userResponse.data.username,
      access_token,
    });
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

// Facebook OAuth
router.get('/facebook/oauth', (req, res) => {
  const { FACEBOOK_APP_ID, FACEBOOK_REDIRECT_URI } = process.env;
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=pages_messaging,pages_show_list,email`;
  res.redirect(authUrl);
});

router.get('/facebook/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_REDIRECT_URI } = process.env;

    const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        redirect_uri: FACEBOOK_REDIRECT_URI,
        code,
      },
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${access_token}`);

    res.json({
      platform: 'facebook',
      account_id: userResponse.data.id,
      account_name: userResponse.data.name,
      access_token,
    });
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

// WhatsApp Business API setup (simplified - would need proper webhook setup)
router.post('/whatsapp/setup', async (req, res) => {
  try {
    const { access_token, phone_number_id } = req.body;

    // Verify token
    const response = await axios.get(`https://graph.facebook.com/v18.0/${phone_number_id}`, {
      headers: { 'Authorization': `Bearer ${access_token}` },
    });

    res.json({
      platform: 'whatsapp',
      account_id: phone_number_id,
      account_name: response.data.display_phone_number,
      access_token,
    });
  } catch (error) {
    console.error('WhatsApp setup error:', error);
    res.status(500).json({ error: 'Setup failed' });
  }
});

// LinkedIn OAuth
router.get('/linkedin/oauth', (req, res) => {
  const { LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI } = process.env;
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${LINKEDIN_REDIRECT_URI}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  res.redirect(authUrl);
});

router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;

    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
      grant_type: 'authorization_code',
      code,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
      redirect_uri: LINKEDIN_REDIRECT_URI,
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://api.linkedin.com/v2/people/~', {
      headers: { 'Authorization': `Bearer ${access_token}` },
    });

    res.json({
      platform: 'linkedin',
      account_id: userResponse.data.id,
      account_name: `${userResponse.data.localizedFirstName} ${userResponse.data.localizedLastName}`,
      access_token,
    });
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

export { router as authRoutes };