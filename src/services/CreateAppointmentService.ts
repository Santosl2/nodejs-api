import Appointment from "../models/Appointment";
import { getCustomRepository } from "typeorm";
import AppointmentRepository from "../repositories/AppointmentsRepository";
import { startOfHour } from "date-fns";

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider }: Request) {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error("Oops, horário já agendado.");
    }

    const appointment = appointmentsRepository.create({
      provider_id: provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointmentDate;
  }
}

export { CreateAppointmentService };
