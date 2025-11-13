import { registerAs } from '@nestjs/config';

export default registerAs('auth0', () => ({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  callbackUrl: process.env.AUTH0_CALLBACK_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
}));
