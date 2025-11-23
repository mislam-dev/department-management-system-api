import { registerAs } from '@nestjs/config';

export const auth0_m2m = registerAs('auth0_m2m', () => ({
  domain: process.env.AUTH0_M2M_DOMAIN,
  clientId: process.env.AUTH0_M2M_CLIENT_ID,
  clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
  audience: process.env.AUTH0_M2M_AUDIENCE,
  connection: process.env.AUTH0_M2M_CONNECTION,
}));
