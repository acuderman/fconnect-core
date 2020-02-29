import dotenv from 'dotenv'
import { throwException } from '../utils/error-handler';

dotenv.config();

export const DATABASE_CONNECTION_URL: string | undefined = process.env.DATABASE_CONNECTION_URL

function checkEnvironmentVariables (): boolean {
  return DATABASE_CONNECTION_URL !== undefined
}

export function initConfig (): void {
  if (!checkEnvironmentVariables) {
    throwException('ERR_INVALID_ENV_VARIABLES')
  }
}
