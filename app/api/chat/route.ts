import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterResponse } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function sendMessageToModel(
  modelId: string,
  message: string,
  conversationHistory: Array<{ role: string; content: string }> = []
) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in the environment variables.');
  }

  console.log('API Key loaded:', !!OPENROUTER_API_KEY);
  console.log('API Key length:', OPENROUTER_API_KEY?.length);
  console.log('API Key prefix:', OPENROUTER_API_KEY?.substring(0, 12));
  console.log('Making request to model:', modelId);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const maxRetries = 3;

  try {
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const authHeader = `Bearer ${OPENROUTER_API_KEY}`;
    console.log('Authorization header:', authHeader.substring(0, 20) + '...');

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://dhanraj.ai',
          'X-Title': 'Dhanraj.AI - AI Model Comparison'
        },
        body: JSON.stringify({
          model: modelId,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (response.ok) {
        const data: OpenRouterResponse = await response.json();

        if (!data.choices || data.choices.length === 0) {
          throw new Error('No response generated');
        }

        return data.choices[0].message.content;
      }

      const errorData = await response.json().catch(() => ({}));

      // Retry on rate limiting (429) with exponential backoff
      if (response.status === 429 && attempt < maxRetries) {
        const waitMs = 3000 * attempt;
        console.warn(`Rate limited by OpenRouter (429). Retrying in ${waitMs}ms (attempt ${attempt}/${maxRetries}) for model ${modelId}.`);
        await delay(waitMs);
        continue;
      }

      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      const messageFromApi =
        errorData.error?.message ||
        errorData.message ||
        'Unknown error';

      throw new Error(`API Error: ${response.status} - ${messageFromApi}`);
    }

    throw new Error('Exceeded retry limit due to rate limiting');
  } catch (error) {
    console.error(`Error calling ${modelId}:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API Route called with environment check:');
    console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
    console.log('API Key value:', process.env.OPENROUTER_API_KEY?.substring(0, 20) + '...');

    const { modelIds, message, conversationHistory } = await request.json();

    if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      return NextResponse.json({ error: 'modelIds array is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message string is required' }, { status: 400 });
    }

    const responses: Record<string, { content: string; error?: string }> = {};

    // Send requests sequentially to reduce rate limiting from the provider.
    for (const modelId of modelIds) {
      try {
        const history = conversationHistory?.[modelId] || [];
        const content = await sendMessageToModel(modelId, message, history);
        responses[modelId] = { content };
      } catch (error) {
        responses[modelId] = {
          content: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      // Brief pause between model calls to avoid hitting rate limits in parallel.
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return NextResponse.json(responses);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Test endpoint to verify API key
export async function GET() {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const hasApiKey = !!apiKey;
    const keyLength = apiKey?.length || 0;
    const keyPrefix = apiKey?.substring(0, 12) || 'none';

    // Test the API key with a simple request
    let apiTestResult = 'Not tested';
    if (hasApiKey) {
      try {
        const testResponse = await fetch('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (testResponse.ok) {
          apiTestResult = 'API key is valid';
        } else {
          apiTestResult = `API key invalid: ${testResponse.status} ${testResponse.statusText}`;
        }
      } catch (error) {
        apiTestResult = `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    return NextResponse.json({
      apiKeyLoaded: hasApiKey,
      keyLength,
      keyPrefix,
      apiTestResult,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test endpoint failed' },
      { status: 500 }
    );
  }
}