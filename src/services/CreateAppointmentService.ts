import startOfHour from 'date-fns/startOfHour';
import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import { getCustomRepository } from 'typeorm';

interface CreateAppointmentServiceRequest {
  date: Date,
  provider_id : string
}

class CreateAppointmentService {
  private appointmentsRepository : AppointmentsRepository;
  constructor(){
    this.appointmentsRepository = getCustomRepository(AppointmentsRepository);
  }

  public async execute({date, provider_id} : CreateAppointmentServiceRequest ): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
  
    if (findAppointmentInSameDate)
      throw Error('This appointment is already booked');  
      
    const appointment = this.appointmentsRepository.create(
      {provider_id, date : appointmentDate}
    );

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;