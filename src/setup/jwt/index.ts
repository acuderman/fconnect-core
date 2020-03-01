import { sign, verify } from 'jsonwebtoken'
import { SERVER_PRIVATE_KEY } from '../../config/config';
import { ExtendedProtectedRequest } from '../interfaces';

export interface TokenData {
  user_id: string;
  activated: boolean;
  exp: Date;
  iss: string;
}

export function generateJwtToken (user_id: string, activated: boolean): string {
  return sign({
    user_id,
    activated,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
    iss: 'fconnect'
  }, SERVER_PRIVATE_KEY as string);
}

export function verifyBearerToken (req: ExtendedProtectedRequest<any, any, any>): void {
  const authorizationToken: string | undefined = req.headers.authorization?.replace('Bearer ', '');

  if (authorizationToken === undefined) {
    throw new Error('ERR_AUTHORIZATION_TOKEN_NOT_PROVIDED');
  }

  const decodedToken: TokenData = verify(authorizationToken, SERVER_PRIVATE_KEY as string) as TokenData;

  req.tokenData = decodedToken;
}