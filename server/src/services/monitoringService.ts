import * as cron from 'node-cron';
import { checkInstagramMessages } from './platforms/instagram';
import { checkFacebookMessages } from './platforms/facebook';
import { checkWhatsAppMessages } from './platforms/whatsapp';
import { checkLinkedInMessages } from './platforms/linkedin';
import { checkTwitterMessages } from './platforms/twitter';

export const startMonitoring = () => {
  // Check for new messages every 2 minutes
  const task = cron.schedule('*/2 * * * *', async () => {
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

  // Unref so a scheduled job never keeps a short-lived process (tests, CLI
  // invocations) alive after its work is done.
  // node-cron exposes unref at runtime but not in its type definitions.
  const unrefable = task as unknown as { unref?: () => void };
  if (typeof unrefable.unref === 'function') unrefable.unref();

  console.log('Message monitoring service started');
  return task;
};