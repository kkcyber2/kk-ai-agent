import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const initializeDatabase = async () => {
  try {
    // Create tables if they don't exist
    const { error: socialAccountsError } = await supabase.rpc('create_social_accounts_table');
    if (socialAccountsError && !socialAccountsError.message.includes('already exists')) {
      console.error('Error creating social_accounts table:', socialAccountsError);
    }

    const { error: messagesError } = await supabase.rpc('create_messages_table');
    if (messagesError && !messagesError.message.includes('already exists')) {
      console.error('Error creating messages table:', messagesError);
    }

    const { error: logsError } = await supabase.rpc('create_interaction_logs_table');
    if (logsError && !logsError.message.includes('already exists')) {
      console.error('Error creating interaction_logs table:', logsError);
    }

    const { error: settingsError } = await supabase.rpc('create_user_settings_table');
    if (settingsError && !settingsError.message.includes('already exists')) {
      console.error('Error creating user_settings table:', settingsError);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};