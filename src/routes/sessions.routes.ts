import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionRouter = Router();


sessionRouter.post('/', async (req, resp) => {
  const { email, password } = req.body;

  try {
    const authenticateUser = new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({email, password});
    // @ts-ignore
    delete user.password;

    resp.json({ user, token });
  }
  catch (err) {
    resp.status(400).json({error : err.message})
  }
})


export default sessionRouter;