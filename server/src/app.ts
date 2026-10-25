import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { setupRoutes } from './routes';

/**
 * Build the Express app without starting a listener, so tests can exercise
 * real routes over HTTP instead of importing handlers directly.
 */
export const createApp = (): express.Application => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupRoutes(app);
  return app;
};
