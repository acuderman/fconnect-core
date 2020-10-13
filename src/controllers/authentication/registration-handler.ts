import { API } from '../../exposed-interfaces';
import { DecodedGoogleIdToken, getIdTokenInfo } from '../../services/google';
import {
  activateUser,
  createUser,
  getExistingUsersWithOneOfEmails,
  getUserByGoogleEmail,
  UsersWithStudentEmailWithCount,
} from '../../dao/user'
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../models/user';
import { sendRegistrationMail } from '../../services/send-mail';
import { generateJwtToken } from '../../setup/jwt';

export async function registerIdentityHandler (body: API.V1.Register.POST.RequestBody): Promise<any> {
  const { student_email, google_id_token }: API.V1.Register.POST.RequestBody = body;

  if (!student_email.endsWith('student.upr.si')) {
    throw new Error('ERR_NOT_FAMNIT_EMAIL');
  }
  const decodedIdToken: DecodedGoogleIdToken = await decodeGoogleIdToken(google_id_token);
  
  const existingUsers: UsersWithStudentEmailWithCount = await getExistingUsersWithOneOfEmails(student_email, decodedIdToken.email);

  if (existingUsers.count > 0) {
    throw new Error('ERR_USER_WITH_THAT_EMAIL_ALREADY_EXISTS');
  }

  const newUser: User = await addNewUser(student_email, decodedIdToken.email);
  await sendRegistrationMail(student_email, newUser.tracking_id);

  return {}
}

async function decodeGoogleIdToken (idToken: string): Promise<DecodedGoogleIdToken> {
  try {
    const decodedToken = await getIdTokenInfo(idToken);

    return decodedToken.data;
  } catch (e) {
    throw new Error('ERR_UNABLE_TO_DECODE_GOOGLE_ID_TOKEN');
  }
}

async function addNewUser(studentEmail: string, googleEmail: string): Promise<User> {
  return createUser({
    id: uuidv4(),
    tracking_id: uuidv4(),
    student_email: studentEmail,
    google_email: googleEmail,
    activated: false,
    expires_at: null,
  })
}

export async function verifyEmailHandler(tracking_id: string): Promise<string> {
  const expiresAt: Date = getExpiresAtDate();
  await activateUser(tracking_id, expiresAt);

  return 'User successfully activated'
}

function getExpiresAtDate (): Date {
  const currentDate: Date = new Date();

  if (currentDate.getMonth() > 8) {
    return new Date(currentDate.getFullYear() + 1, 9, 1, 0, 0, 0, 0);
  }

  return new Date(currentDate.getFullYear(), 9, 1, 0, 0, 0, 0);
}

export async function loginHandler (body: API.V1.Login.POST.RequestBody): Promise<API.V1.Login.POST.Response> {
  const { google_id_token }: API.V1.Login.POST.RequestBody = body;

  const decodedIdToken: DecodedGoogleIdToken = await decodeGoogleIdToken(google_id_token);

  const user: User | null = await getUserByGoogleEmail(decodedIdToken.email);

  if (user === null) {
    throw new Error('ERR_USER_DOES_NOT_EXIST');
  }

  if (!user.activated) {
    throw new Error('ERR_USER_NOT_ACTIVATED')
  }

  const access_token: string = generateJwtToken(user.id);

  return {
    access_token,
  }
}
