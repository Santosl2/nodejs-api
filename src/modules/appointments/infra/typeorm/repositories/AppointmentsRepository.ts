import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import { EntityRepository, getRepository, Raw, Repository } from "typeorm";
import Appointment from "../entities/Appointment";

@EntityRepository(Appointment)
class AppointmentRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
      },
    });

    return findAppointment || undefined;
  }

  public async create({
    date,
    provider_id,
    user_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({
    month,
    provider_id,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, "0");

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName => `
          to_char(${dateFieldName}, "MM-YYYY") = "${parsedMonth}-${year}"
        `,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    month,
    provider_id,
    year,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, "0");
    const parsedMonth = String(month).padStart(2, "0");

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName => `
          to_char(${dateFieldName}, "DD-MM-YYYY") = "${parsedDay}-${parsedMonth}-${year}"
        `,
        ),
      },
    });

    return appointments;
  }
}

export default AppointmentRepository;
