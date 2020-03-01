import { API } from '../../exposed-interfaces';
import { DecodedGoogleIdToken, getIdTokenInfo } from '../../services/google';
import {
  activateUser,
  createUser,
  getExistingUsersWithOneOfEmails, getUserById,
  UsersWithStudentEmailWithCount
} from '../../dao/user';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../models/user';
import { sendRegistrationMail } from '../../services/send-mail';
import { generateJwtToken, verifyBearerToken } from '../../setup/jwt';
import { ExtendedProtectedRequest } from '../../setup/interfaces';

export async function registerIdentityHandler (body: API.V1.Register.POST.RequestBody): Promise<API.V1.Register.POST.Response> {
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

  const access_token: string = generateJwtToken(newUser.id, false)

  return {
    access_token,
  }
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

export async function swapAccessTokenHandler(req: ExtendedProtectedRequest<{}, {}, {}>): Promise<API.V1.Register.GET.Activated.Response> {
  try {
    verifyBearerToken(req);
  } catch (e) {
    throw new Error('ERR_INVALID_TOKEN');
  }

  const user_id: string = req.tokenData.user_id;
  const user: User | null = await getUserById(user_id);

  if (user === null) {
    throw new Error('ERR_USER_DOES_NOT_EXIST')
  }
  
  if (user.activated) {
    const access_token: string = generateJwtToken(user_id, true);
    
    return {
      activated: true,
      access_token,
    }
  }

  const access_token: string = generateJwtToken(user_id, false);

  return {
    activated: false,
    access_token,
  }
}

// TODO add login route that checks google id token, checks in db if user has activated account and issues access token
// Othervise it returns activated: false with false access token so we can send him to waiting screen
