import { User } from '../core/authentication/auth/user.entity'; // or whatever your User type is

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
