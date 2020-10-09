import { getCustomRepository } from "typeorm";
import UsersRepository from "../repositories/UsersRepository";
import path from 'path';
import User from "../models/User";
import fs from 'fs';

import multer from 'multer';
import uploadConfig from '../config/upload'
import { fromString } from "uuidv4";
import AppError from '../errors/AppError'


interface UpdateUserAvatarRequest {
  user_id: string,
  avatarFileName : string
}


class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName} : UpdateUserAvatarRequest) : Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne({ where : { id : user_id }});
  
    if (!user)
      throw new AppError('User Not Found!', 401)

    if(user.avatar){
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      try {
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

        if (userAvatarFileExists)
          await fs.promises.unlink(userAvatarFilePath);
      } catch (err) {
        console.error(err);
        
      }
    }

    user.avatar = avatarFileName;
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;