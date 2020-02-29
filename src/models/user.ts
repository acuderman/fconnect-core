import { DataTypes, Model } from 'sequelize';
import { database } from '../setup/sequlize';

export class User extends Model {
    public id!: number;
    public google_email!: string;
    public famnit_email!: string | null;
    public activated!: boolean;
    public verification_url_uuid!: string;
    public expires_at!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    primaryKey: true,
  },
  google_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  famnit_email: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  },
  activated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    defaultValue: null,
    allowNull: true,
  }
}, {
  sequelize: database,
  tableName: 'users'
});