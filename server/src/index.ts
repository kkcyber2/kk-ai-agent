import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeDatabase } from './utils/database';
import { setupRoutes } from './routes';
import { startMonitoring } from './services/monitoringService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// Setup routes
setupRoutes(app);

// Start monitoring service
startMonitoring();

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Social Media Assistant server running on port ${PORT}`);
});

export default app;