import dotenv from 'dotenv'
// import { initDatabase } from './setup/sequlize'

dotenv.config();

export const DATABASE_CONNECTION_URL: string | undefined = process.env.DATABASE_CONNECTION_URL;
export const SENDGRID_API_KEY: string | undefined = process.env.SENDGRID_API_KEY;
export const BASE_URI: string | undefined = process.env.BASE_URL;
export const SERVER_PRIVATE_KEY: string | undefined = process.env.SERVER_PRIVATE_KEY;

export const GOOGLE_API_BASE_URL: string = 'https://oauth2.googleapis.com/';


export async function initConfig (): Promise<void> {
  if (!checkEnvironmentVariables()) {
    // eslint-disable-next-line no-console
    console.log('ERR_INVALID_ENVIRONMENT_VARIABLES');
    process.exit(1);
  }

  // await initDatabase()
}

function checkEnvironmentVariables (): boolean {
  return DATABASE_CONNECTION_URL !== undefined
      && SENDGRID_API_KEY !== undefined
      && BASE_URI !== undefined
}
