import axios from 'axios'
import { GOOGLE_API_BASE_URL } from '../../config';

export interface DecodedGoogleIdToken {
    'iss': string;
    'sub': string;
    'azp': string;
    'aud': string;
    'iat': string;
    'exp': string;
    'email': string;
    'email_verified': string;
    'name': string;
    'picture': string;
    'given_name': string;
    'family_name': string;
    'locale': string;
}

export function getIdTokenInfo(idToken: string): Promise<{data: DecodedGoogleIdToken}>  {
  return axios.get(`${GOOGLE_API_BASE_URL}/tokeninfo?id_token=${idToken}`)
}
