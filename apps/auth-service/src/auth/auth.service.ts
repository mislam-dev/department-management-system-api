import { Injectable } from '@nestjs/common';
import { Auth0Service } from '../auth0/auth0.service';

@Injectable()
export class AuthService {
  constructor(private readonly auth0: Auth0Service) {}
  async roles() {
    const roles = await this.auth0.getAllRoles();
    return roles.data;
  }
  async me() {
    const roles = await this.auth0.getAllRoles();
    return roles.data;
  }
  async profile(auth0_sub: string) {
    const user = await this.auth0.getUser(auth0_sub);
    const { email, name, nickname, picture, user_id } = user;
    return {
      email,
      name,
      nickname,
      picture,
      user_id,
    };
  }
}

export type Auth0User = {
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: [
    {
      connection: string;
      provider: 'auth0';
      user_id: string;
      isSocial: boolean;
    },
  ];
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  last_password_reset: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
};
