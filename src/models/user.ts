import { DataTypes, Model } from 'sequelize';
import { database } from '../setup/sequlize';

export class User extends Model {
    public id!: string;
    public google_email!: string;
    public student_email!: string;
    public activated!: boolean;
    public tracking_id!: string;
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
  student_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tracking_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
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