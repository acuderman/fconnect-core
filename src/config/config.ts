import dotenv from 'dotenv'

dotenv.config();

export const DATABASE_CONNECTION_URL: string | undefined = process.env.DATABASE_CONNECTION_URL

export function initConfig (): void {
  if (!checkEnvironmentVariables()) {
    // eslint-disable-next-line no-console
    console.log('ERR_INVALID_ENVIRONMENT_VARIABLES');
    process.exit(1);
  }
}

function checkEnvironmentVariables (): boolean {
  return DATABASE_CONNECTION_URL !== undefined
}
