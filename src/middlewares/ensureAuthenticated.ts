import {Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import authconfig from '../config/auth'

interface TokenPayload {
  iat: number,
  exp: number,
  sub: string
}


export default function ensureAuthenticated(req : Request, resp: Response, next:  NextFunction) : void {
  const authHeader = req.headers.authorization;

  if(!authHeader)
    throw new Error('JWT Missing.');

  const [,token] = authHeader.split(' ');

  try {
    const decode = verify(token,authconfig.jwt.secret);

    const { sub } = decode as TokenPayload;
    req.user = {
      id : sub,
    }

    next();
  } catch (err) {
    throw new Error('Invalid JWT!')
  }
}