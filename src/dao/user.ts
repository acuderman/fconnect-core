import { User } from '../models/user';
import { Op } from 'sequelize'

export interface UsersWithStudentEmailWithCount {
  rows: User[];
  count: number;
}

export async function getExistingUsersWithOneOfEmails (student_email: string, google_email: string): Promise<UsersWithStudentEmailWithCount> {
  return User.findAndCountAll({
    where: {
      [Op.or]: [
        { student_email: student_email },
        { google_email: google_email }
      ]
    }
  })
}

export async function createUser (model: Partial<User>): Promise<User> {
  return User.create(model)
}

export async function activateUser (tracking_id: string, expires_at: Date): Promise<[number, User[]]> {
  const updateValues = {
    activated: true,
    expires_at: expires_at,
  };

  const whereStatement = {
    where: { 
      tracking_id,
    }
  };

  return User.update(updateValues, whereStatement)
}

export async function getUserById (user_id: string): Promise<User | null> {

  return User.findOne({
    where: {
      id: user_id
    }
  })
}