import FakeAppointmentRepository from "../infra/typeorm/repositories/fakes/FakeAppointmentsRepository";
import { CreateAppointmentService } from "./CreateAppointmentService";
import AppError from "@shared/errors/AppError";

describe("CreateAppointmentService", () => {
  it("should be able to create a new appointment", async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider: "JesusSaves",
    });

    expect(appointment).toHaveProperty("id");
    expect(appointment.provider_id).toBe("JesusSaves");
  });

  it("should not be able to create a two appointments on the same date", async () => {
    const date = new Date(2020, 4, 10, 11); // ano, mes, dia e hora
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    await createAppointment.execute({
      date,
      provider: "JesusSaves",
    });

    expect(
      createAppointment.execute({
        date,
        provider: "JesusSaves",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
