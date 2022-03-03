import { inject, injectable } from "tsyringe";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import { getDate, getDaysInMonth, getHours } from "date-fns";
import isAfter from "date-fns/isAfter";

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject("AppointmentRepository")
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id: providerId,
        month,
        day,
        year,
      });

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export { ListProviderDayAvailabilityService };
