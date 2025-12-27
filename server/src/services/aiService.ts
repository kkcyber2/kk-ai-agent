import OpenAI from 'openai';
import { supabase } from '../utils/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeMessage = async (message: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Analyze the sentiment of this message and respond with only one word: positive, negative, or neutral.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 10,
    });

    return completion.choices[0].message.content?.toLowerCase().trim() || 'neutral';
  } catch (error) {
    console.error('AI sentiment analysis error:', error);
    return 'neutral';
  }
};

export const generateResponse = async (
  message: string,
  platform: string,
  context?: string
): Promise<string> => {
  try {
    // Get user preferences for this platform
    const { data: settings } = await supabase
      .from('user_settings')
      .select('response_style, auto_approve')
      .eq('platform', platform)
      .single();

    const style = settings?.response_style || 'professional';

    let systemPrompt = `You are a social media assistant. Generate a ${style} response to this message. `;

    if (context) {
      systemPrompt += `Context: ${context}. `;
    }

    systemPrompt += 'Keep responses concise and appropriate for the platform.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 150,
    });

    return completion.choices[0].message.content?.trim() || 'Thank you for your message!';
  } catch (error) {
    console.error('AI response generation error:', error);
    return 'Thank you for your message. I\'ll get back to you soon.';
  }
};

export const shouldAutoApprove = async (message: string, platform: string): Promise<boolean> => {
  try {
    const { data: settings } = await supabase
      .from('user_settings')
      .select('auto_approve_keywords, auto_reject_keywords')
      .eq('platform', platform)
      .single();

    if (!settings) return false;

    const approveKeywords = settings.auto_approve_keywords || [];
    const rejectKeywords = settings.auto_reject_keywords || [];

    const lowerMessage = message.toLowerCase();

    // Check for reject keywords first
    for (const keyword of rejectKeywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return false;
      }
    }

    // Check for approve keywords
    for (const keyword of approveKeywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Auto-approve check error:', error);
    return false;
  }
};