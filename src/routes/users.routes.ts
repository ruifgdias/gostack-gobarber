import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UsersRepository from '../repositories/UsersRepository';
import CreateUserService from '../services/CreateUserService';

import path from 'path';
import multer from 'multer';
import uploadConfig from '../config/upload'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, resp) => {
  const { name, email, password } = req.body;

  try {
    const user = await new CreateUserService().execute({name, email, password});
    // @ts-ignore
    delete user.password;
    resp.json(user);
  }
  catch (err) {
    resp.status(400).json({error : err.message})
  }
})

usersRouter.get('/list', async (req, resp) => {
  resp.json(await getCustomRepository(UsersRepository).find());
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'),
async (req, resp) => {
  const { id } = req.user;

  const updateUserAvatar = new UpdateUserAvatarService();
  const user = await updateUserAvatar.execute({ user_id : id, avatarFileName: req.file.filename})
  // @ts-ignore
  delete user.password;
  return resp.status(200).json(user);
})

export default usersRouter;