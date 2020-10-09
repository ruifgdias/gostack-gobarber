import {Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import authconfig from '../config/auth'
import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number,
  exp: number,
  sub: string
}


export default function ensureAuthenticated(req : Request, resp: Response, next:  NextFunction) : void {
  const authHeader = req.headers.authorization;

  if(!authHeader)
    throw new AppError('JWT Missing.', 401);

  const [,token] = authHeader.split(' ');

  try {
    const decode = verify(token,authconfig.jwt.secret);

    const { sub } = decode as TokenPayload;
    req.user = {
      id : sub,
    }

    next();
  } catch (err) {
    throw new AppError('Invalid JWT!', 401)
  }
}