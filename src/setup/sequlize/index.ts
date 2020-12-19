import { Sequelize } from 'sequelize';
import { DATABASE_CONNECTION_URL } from '../../config';
import { exec } from 'child_process'

export const database: Sequelize = new Sequelize(DATABASE_CONNECTION_URL as string);

export async function initDatabase (): Promise<void> {
  await new Promise((resolve, reject) => {
    const migrate = exec(
      `npx sequelize-cli db:migrate --url ${DATABASE_CONNECTION_URL}`,
      err => (err ? reject(err): resolve(1))
    );

    migrate.stdout?.pipe(process.stdout);
    migrate.stderr?.pipe(process.stderr);
  });
}
