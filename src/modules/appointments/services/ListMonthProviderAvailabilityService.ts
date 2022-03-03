import { inject, injectable } from "tsyringe";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import { getDate, getDaysInMonth } from "date-fns";

interface IRequest {
  providerId: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListMonthProviderAvailabilityService {
  constructor(
    @inject("AppointmentRepository")
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointmentsInMonth =
      await this.appointmentsRepository.findAllInMonthFromProvider({
        provider_id: providerId,
        year,
        month,
      });

    const numberOfDaysInMonths = getDaysInMonth(new Date(year, month - 1));

    // CRIA UM ARRAY
    const eachDayArray = Array.from(
      {
        length: numberOfDaysInMonths,
      },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointmentsInMonth.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export { ListMonthProviderAvailabilityService };
