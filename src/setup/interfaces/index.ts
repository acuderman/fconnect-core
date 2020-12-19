import { Request } from 'express';
import { TokenData } from '../jwt';
import { ParsedQs } from 'qs'

interface ParamsDictionary {
    [key: string]: string;
}

export interface ExtendedExposedRequest <P extends ParamsDictionary, E, K extends ParsedQs> extends Request {
    body: E;
    params: P;
    query: K;
}


export interface ExtendedProtectedRequest <P extends ParamsDictionary, E, K extends ParsedQs> extends Request {
    tokenData: TokenData;
    body: E;
    params: P;
    query: K;
}
