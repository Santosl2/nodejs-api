import { inject, injectable } from "tsyringe";
import { startOfHour } from "date-fns";
import AppError from "@shared/errors/AppError";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
  provider: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentRepository")
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ date, provider }: IRequest) {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError("Oops, horário já agendado.");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id: provider,
      date: appointmentDate,
    });

    return appointmentDate;
  }
}

export { CreateAppointmentService };
