import express from 'express';
import { authRoutes } from './auth';
import { platformRoutes } from './platforms';
import { messageRoutes } from './messages';
import { dashboardRoutes } from './dashboard';
import { settingsRoutes } from './settings';

export const setupRoutes = (app: express.Application) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/platforms', platformRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/settings', settingsRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error handler. Honour the status the error already carries: body-parser
  // raises a 400 for malformed JSON, and flattening that to 500 told clients
  // their payload was fine and our server was broken.
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = Number(err?.status || err?.statusCode) || 500;
    if (status >= 500) {
      console.error(err?.stack || err);
      res.status(status).json({ error: 'Something went wrong!' });
      return;
    }
    res.status(status).json({ error: err?.message || 'Bad request' });
  });
};