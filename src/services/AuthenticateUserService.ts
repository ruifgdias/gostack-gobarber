import { compare } from "bcryptjs";
import { getCustomRepository } from "typeorm";
import User from "../models/User";
import UsersRepository from "../repositories/UsersRepository";
import { sign } from 'jsonwebtoken';
import authconfig from '../config/auth'

import AppError from '../errors/AppError'

interface AuthenticateUserRequest {
  email: string,
  password: string,
}

interface AuthenticateUserResponse {
  user: User,
  token: string
}

class AuthenticateUserService {
  
  public async execute({email, password} :  AuthenticateUserRequest) : Promise<AuthenticateUserResponse>{
    const usersRepository = getCustomRepository(UsersRepository);
    
    const user = await usersRepository.findOne({where : { email}});

    if (!user)
      throw new AppError('Incorrect email/password combination.', 401);

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched)
      throw new AppError('Incorrect email/password combination.', 401);

      const {secret , expiresIn } = authconfig.jwt;
    const token = sign({ },secret,{
      subject: user.id,
      expiresIn: expiresIn
    });

    return {
      user,
      token
    }
  }
}

export default AuthenticateUserService;