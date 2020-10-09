import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import AppointmentsRespository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService';
import { getCustomRepository } from 'typeorm';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (req, resp) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRespository);
  resp.json(await appointmentsRepository.find());
})

appointmentsRouter.post('/', async (req, resp) => {
  try {
    const { provider_id, date } = req.body;
    const parsedDate = parseISO(date);
    const createAppointmentService = new CreateAppointmentService();
  
    const appointment = await createAppointmentService.execute({date:parsedDate,provider_id});
  
    return resp.json(appointment);

  } catch (err) {
    resp.status(400).json({error: err.message})
  }

})

export default appointmentsRouter;