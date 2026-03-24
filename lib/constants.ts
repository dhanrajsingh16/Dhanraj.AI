import { AIModel } from '@/types';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'arcee-ai/trinity-large-preview:free',
    name: 'arcee-ai/trinity-large-preview:free',
    displayName: 'Arcee Trinity Large',
    color: 'from-gray-700 to-slate-900',
    provider: 'Arcee AI',
    description: 'Large-scale language model with comprehensive capabilities'
  },
  {
    id: 'google/gemma-3n-e2b-it:free',
    name: 'google/gemma-3n-e2b-it:free',
    displayName: 'Google Gemma 3n E2B',
    color: 'from-indigo-500 to-purple-500',
    provider: 'Google',
    description: 'High-quality instruction-tuned model from Google'
  },
  {
    id: 'liquid/lfm-2.5-1.2b-thinking:free',
    name: 'liquid/lfm-2.5-1.2b-thinking:free',
    displayName: 'LFM 2.5 1.2B Thinking',
    color: 'from-red-500 to-rose-500',
    provider: 'Liquid AI',
    description: 'Efficient thinking model with advanced reasoning capabilities'
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    name: 'nvidia/nemotron-3-super-120b-a12b:free',
    displayName: 'Nvidia Nemotron 3 Super',
    color: 'from-blue-500 to-cyan-500',
    provider: 'Nvidia',
    description: 'High-performance reasoning model for large-scale tasks'
  }
];

export const DEFAULT_MODELS = AVAILABLE_MODELS.slice(0, 4);

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
