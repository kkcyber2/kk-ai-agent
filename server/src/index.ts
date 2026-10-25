import dotenv from 'dotenv';
import { createServer } from 'http';
import { createApp } from './app';
import { initializeDatabase } from './utils/database';
import { startMonitoring } from './services/monitoringService';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const app = createApp();
initializeDatabase().catch((err) => console.error('Database init failed:', err.message));
startMonitoring();

const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Social media assistant API listening on ${PORT}`);
});

export default app;
