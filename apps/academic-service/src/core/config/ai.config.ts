import { registerAs } from '@nestjs/config';

export const aiConfig = registerAs('ai', () => ({
  gemini_api: process.env.GOOGLE_GEMINI_API_KEY,
}));
