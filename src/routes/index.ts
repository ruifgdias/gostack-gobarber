import { Router, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import AppError from '../errors/AppError';
import appointmentsRouter from './appointments.routes';
import sessionRouter from './sessions.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/appointments',appointmentsRouter)
routes.use('/sessions',sessionRouter)
routes.use('/users',usersRouter)

routes.use(
  (err : Error, req : Request, resp: Response, _ : NextFunction) => {
    if (err instanceof AppError) 
      return resp.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });

    console.error(err);
    
    return resp.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })

});

export default routes;