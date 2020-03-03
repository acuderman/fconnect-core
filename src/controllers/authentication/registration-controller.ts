import { ExtendedExposedRequest } from '../../setup/interfaces';
import {
  registerIdentityHandler,
  verifyEmailHandler,
  loginHandler
} from './registration-handler';
import { Response } from 'express';


import { API } from '../../exposed-interfaces';
import RegisterRequestBody = API.V1.Register.POST.RequestBody;
import VerifyEmailParams = API.V1.Register.GET.Verify.RequestParams;
import LoginRequestBody = API.V1.Login.POST.RequestBody;


export function registerController (req: ExtendedExposedRequest<{}, RegisterRequestBody, {}>): Promise<API.V1.Register.POST.Response> {
  const body: RegisterRequestBody = req.body;

  return registerIdentityHandler(body)
}

export async function verifyEmailController(req: ExtendedExposedRequest<VerifyEmailParams, {}, {}>, res: Response): Promise<Response> {
  const trackingId: string = req.params.tracking_id;

  const responseHtml: string = await verifyEmailHandler(trackingId);

  return res.send(responseHtml);
}

export async function loginController(req: ExtendedExposedRequest<{}, LoginRequestBody, {}>): Promise<API.V1.Login.POST.Response> {
  return loginHandler(req.body)
}
