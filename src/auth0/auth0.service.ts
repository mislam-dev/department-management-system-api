import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Management, ManagementClient } from 'auth0';
import { Auth0User } from './autho.types';

@Injectable()
export class Auth0Service {
  private auth0: ManagementClient;
  private connection: string = 'Username-Password-Authentication';

  constructor(private readonly config: ConfigService) {
    this.auth0 = new ManagementClient({
      domain: config.get<string>('auth0_m2m.domain')!,
      clientId: config.get<string>('auth0_m2m.clientId')!,
      clientSecret: config.get<string>('auth0_m2m.clientSecret')!,
    });
    this.connection = this.config.get<string>('auth0_m2m.connection')!;
  }

  async getUsers(): Promise<any[]> {
    const users = await this.auth0.users.list();
    return users.data;
  }
  async getUser(id: string): Promise<Auth0User> {
    const user = await this.auth0.users.get(id);
    if (!user) throw new NotFoundException('No user found!');
    return user;
  }
  async getUserByEmail(email: string): Promise<Auth0User[]> {
    const users = await this.auth0.users.list({
      q: `email:"${email}"`,
      search_engine: 'v3',
    });
    if (users.data.length <= 0) throw new NotFoundException('No user found!');
    return users.data;
  }
  async createUser(
    data: Omit<Management.CreateUserRequestContent, 'connection'>,
  ) {
    const res = await this.auth0.users.create({
      connection: this.connection,
      ...data,
    });

    return res;
  }
  async updateUser(
    id: string,
    data: Omit<Management.UpdateUserRequestContent, 'connection'>,
  ) {
    const user = await this.auth0.users.update(id, {
      connection: this.connection,
      ...data,
    });
    return user;
  }
  async deleteUser(id: string) {
    return await this.auth0.users.delete(id);
  }
}
