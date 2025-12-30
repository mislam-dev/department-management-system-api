/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GenerateContentConfig, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiAiAgent {
  private ai: GoogleGenAI;
  private defaultModel: string = 'gemini-2.5-flash';

  constructor(private config: ConfigService) {
    const apiKey = this.config.getOrThrow<string>('GOOGLE_GEMINI_API_KEY');

    this.ai = new GoogleGenAI({ apiKey });
  }

  async ask(prompt: string, config?: GenerateContentConfig) {
    const response = await this.ai.models.generateContent({
      model: this.defaultModel,
      contents: prompt,
      config,
    });

    return response.text as string;
  }
}
