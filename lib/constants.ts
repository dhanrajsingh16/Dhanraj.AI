import { AIModel } from '@/types';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    name: 'nvidia/nemotron-3-super-120b-a12b:free',
    displayName: 'Nvidia Nemotron 3 Super',
    color: 'from-gray-700 to-slate-900',
    provider: 'Nvidia',
    description: 'High-performance reasoning model designed for large-scale tasks'
  },
  {
    id: 'liquid/lfm-2.5-1.2b-thinking:free',
    name: 'liquid/lfm-2.5-1.2b-thinking:free',
    displayName: 'LFM2.5-1.2B',
    color: 'from-indigo-500 to-purple-500',
    provider: 'LiquidAI',
    description: 'Efficient thinking model with advanced reasoning capabilities'
  },
  {
    id: 'arcee-ai/trinity-large-preview:free',
    name: 'arcee-ai/trinity-large-preview:free',
    displayName: 'Trinity Large Preview',
    color: 'from-red-500 to-rose-500',
    provider: 'Arcee AI',
    description: 'Large-scale language model with comprehensive capabilities'
  },
  {
    id: 'google/gemma-3n-e4b-it:free',
    name: 'google/gemma-3n-e4b-it:free',
    displayName: 'Google Gemma 3n E4B',
    color: 'from-blue-500 to-cyan-500',
    provider: 'Google',
    description: 'High-quality instruction-tuned model from Google'
  }
];

export const DEFAULT_MODELS = AVAILABLE_MODELS.slice(0, 4);

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
