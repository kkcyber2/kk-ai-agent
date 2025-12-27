import * as cron from 'node-cron';
import { checkInstagramMessages } from './platforms/instagram';
import { checkFacebookMessages } from './platforms/facebook';
import { checkWhatsAppMessages } from './platforms/whatsapp';
import { checkLinkedInMessages } from './platforms/linkedin';
import { checkTwitterMessages } from './platforms/twitter';

export const startMonitoring = () => {
  // Check for new messages every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    console.log('Checking for new messages...');

    try {
      await Promise.all([
        checkInstagramMessages(),
        checkFacebookMessages(),
        checkWhatsAppMessages(),
        checkLinkedInMessages(),
        checkTwitterMessages(),
      ]);
    } catch (error) {
      console.error('Error during message monitoring:', error);
    }
  });

  console.log('Message monitoring service started');
};