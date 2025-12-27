import express from 'express';
import { supabase } from '../utils/database';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get message counts by platform and status
    const { data: messageStats, error: messageError } = await supabase
      .from('messages')
      .select('platform, status')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (messageError) throw messageError;

    // Calculate statistics
    const stats = {
      totalMessages: messageStats.length,
      pendingMessages: messageStats.filter(m => m.status === 'pending').length,
      respondedMessages: messageStats.filter(m => m.status === 'responded').length,
      pendingApproval: messageStats.filter(m => m.status === 'pending_approval').length,
      byPlatform: {} as Record<string, number>,
    };

    messageStats.forEach(message => {
      stats.byPlatform[message.platform] = (stats.byPlatform[message.platform] || 0) + 1;
    });

    // Get recent activity
    const { data: recentActivity, error: activityError } = await supabase
      .from('interaction_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (activityError) throw activityError;

    // Get sentiment analysis
    const { data: sentimentData, error: sentimentError } = await supabase
      .from('messages')
      .select('sentiment')
      .not('sentiment', 'is', null);

    if (sentimentError) throw sentimentError;

    const sentimentStats = {
      positive: sentimentData.filter(m => m.sentiment === 'positive').length,
      negative: sentimentData.filter(m => m.sentiment === 'negative').length,
      neutral: sentimentData.filter(m => m.sentiment === 'neutral').length,
    };

    res.json({
      stats,
      recentActivity,
      sentimentStats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get interaction logs
router.get('/logs', async (req, res) => {
  try {
    const { platform, action, limit = 50 } = req.query;

    let query = supabase
      .from('interaction_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (platform) {
      query = query.eq('platform', platform);
    }

    if (action) {
      query = query.eq('action', action);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export { router as dashboardRoutes };