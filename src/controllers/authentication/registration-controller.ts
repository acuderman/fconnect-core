import { ExtendedExposedRequest, ExtendedProtectedRequest } from '../../setup/interfaces';
import { swapAccessTokenHandler, registerIdentityHandler, verifyEmailHandler } from './registration-handler';
import { Response } from 'express';


import { API } from '../../exposed-interfaces';
import RegisterRequestBody = API.V1.Register.POST.RequestBody;
import VerifyEmailParams = API.V1.Register.GET.Verify.RequestParams;


export function register (req: ExtendedExposedRequest<{}, RegisterRequestBody, {}>): Promise<API.V1.Register.POST.Response> {
  const body: RegisterRequestBody = req.body;

  return registerIdentityHandler(body)
}

export async function verifyEmail(req: ExtendedExposedRequest<VerifyEmailParams, {}, {}>, res: Response): Promise<Response> {
  const trackingId: string = req.params.tracking_id;

  const responseHtml: string = await verifyEmailHandler(trackingId);

  return res.send(responseHtml);
}

export async function swapAccessToken (req: ExtendedExposedRequest<{}, {}, {}>): Promise<API.V1.Register.GET.Activated.Response> {
  const request = req as ExtendedProtectedRequest<{}, {}, {}>;

  return swapAccessTokenHandler(request)
}