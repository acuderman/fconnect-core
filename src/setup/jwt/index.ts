import { sign, verify } from 'jsonwebtoken'
import { SERVER_PRIVATE_KEY } from '../../config/config';
import { ExtendedProtectedRequest } from '../interfaces';

export interface TokenData {
  user_id: string;
  activated: boolean;
  exp: Date;
  iss: string;
}

export function generateJwtToken (user_id: string): string {
  return sign({
    user_id,
    iss: 'fconnect'
  }, SERVER_PRIVATE_KEY as string);
}

export function verifyBearerToken (req: ExtendedProtectedRequest<any, any, any>): void {
  const authorizationToken: string | undefined = req.headers.authorization?.replace('Bearer ', '');

  if (authorizationToken === undefined) {
    throw new Error('ERR_AUTHORIZATION_TOKEN_NOT_PROVIDED');
  }

  req.tokenData = verify(authorizationToken, SERVER_PRIVATE_KEY as string) as TokenData;
}
