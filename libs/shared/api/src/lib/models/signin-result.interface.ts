import { Token } from './token.type';
import { IUser } from './user.interface';

export interface ISignInResult {
  access_token: Token;
  user: IUser;
}
