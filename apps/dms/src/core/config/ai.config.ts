import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  gemini_api: process.env.GOOGLE_GEMINI_API_KEY,
}));
