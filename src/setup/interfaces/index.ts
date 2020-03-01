import { Request } from 'express';
import { TokenData } from '../jwt';

interface ParamsDictionary {
    [key: string]: string;
}

export interface ExtendedExposedRequest <P extends ParamsDictionary, E, K> extends Request {
    body: E;
    params: P;
    query: K;
}


export interface ExtendedProtectedRequest <P extends ParamsDictionary, E, K> extends Request {
    tokenData: TokenData;
    body: E;
    params: P;
    query: K;
}
