import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';

export const AUTH0 = 'AUTH0_MANAGEMENT_CLIENT';

export const Auth0ManagementProvider = {
  provide: AUTH0,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new ManagementClient({
      domain: config.get<string>('auth0_m2m.domain')!,
      clientId: config.get<string>('auth0_m2m.clientId')!,
      clientSecret: config.get<string>('auth0_m2m.clientSecret')!,
    });
  },
};
