import { Management } from 'auth0';

export type Auth0User = Management.GetUserResponseContent;
export type Auth0Error = {
  statusCode: number;
  error: string;
  message: string;
  errorCode?: string;
};
