import dotenv from 'dotenv'
import { exec } from 'child_process'

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

  await initDatabase()
}

function checkEnvironmentVariables (): boolean {
  return DATABASE_CONNECTION_URL !== undefined
      && SENDGRID_API_KEY !== undefined
      && BASE_URI !== undefined
}

async function initDatabase (): Promise<void> {
  await new Promise((resolve, reject) => {
    const migrate = exec(
      `npx sequelize-cli db:migrate --url ${DATABASE_CONNECTION_URL}`,
      err => (err ? reject(err): resolve(1))
    );

    migrate.stdout?.pipe(process.stdout);
    migrate.stderr?.pipe(process.stderr);
  });
}
