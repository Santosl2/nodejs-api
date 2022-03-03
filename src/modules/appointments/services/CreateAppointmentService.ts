import { inject, injectable } from "tsyringe";
import { getHours, isBefore, startOfHour } from "date-fns";
import AppError from "@shared/errors/AppError";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import Appointment from "../infra/typeorm/entities/Appointment";

interface IRequest {
  provider: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentRepository")
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    date,
    provider,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    if (user_id === provider) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can only create appointments between 8am and 5pm.",
      );
    }

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError("Oops, horário já agendado.");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id: provider,
      date: appointmentDate,
      user_id,
    });

    return appointment;
  }
}

export { CreateAppointmentService };
