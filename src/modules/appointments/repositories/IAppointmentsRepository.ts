import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IFindAllInDayFromProviderDTO from "../dtos/IFindAllInDayFromProviderDTO";
import IFindAllInMonthFromProviderDTO from "../dtos/IFindAllInMonthFromProviderDTO";
import Appointment from "../infra/typeorm/entities/Appointment";

export default interface IAppointmentsRepository {
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;

  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;

  findByDate(date: Date): Promise<Appointment | undefined>;

  create(data: ICreateAppointmentDTO): Promise<Appointment>;
}
