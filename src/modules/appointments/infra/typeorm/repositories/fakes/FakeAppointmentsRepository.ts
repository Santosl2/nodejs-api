import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import { isEqual, getDate, getMonth, getYear } from "date-fns";
import { v4 as uuid } from "uuid";
import Appointment from "../../entities/Appointment";

class FakeAppointmentRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointments = this.appointments.find(appointments =>
      isEqual(appointments.date, date),
    );

    return findAppointments;
  }

  public async create({
    date,
    provider_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
    });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({
    month,
    provider_id,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const findAppointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id == provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
    });

    return findAppointments;
  }
}

export default FakeAppointmentRepository;
