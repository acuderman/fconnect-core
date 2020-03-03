import sendgrid from 'sendgrid'
import { BASE_URI, SENDGRID_API_KEY } from '../../config';


export async function sendRegistrationMail (email: string, confirm_uuid: string): Promise<void> {
  const sendMail = sendgrid(SENDGRID_API_KEY as string);
  const request = sendMail.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: email,
            },
          ],
          subject: 'Verify your email',
        },
      ],
      from: {
        email: 'no-reply@famnit-connect.herokuapp.com',
      },
      content: [
        {
          type: 'text/plain',
          value: `Please click on the following link to verify your email: ${BASE_URI}/v1/register/verify/${confirm_uuid}`,
        },
      ],
    },
  });

  await sendMail.API(request)
}
