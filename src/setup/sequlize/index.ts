import { Sequelize } from 'sequelize';
import { DATABASE_CONNECTION_URL } from '../../config/config';

export const database: Sequelize = new Sequelize(DATABASE_CONNECTION_URL as string);
