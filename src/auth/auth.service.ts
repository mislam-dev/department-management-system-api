import { Injectable } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';

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
  async profile(userId: string) {
    console.log({ userId });
    const roles = await this.auth0.getAllRoles();
    return roles.data;
  }
}
