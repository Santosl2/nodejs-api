import FakeAppointmentRepository from "../infra/typeorm/repositories/fakes/FakeAppointmentsRepository";
import { CreateAppointmentService } from "./CreateAppointmentService";
import AppError from "@shared/errors/AppError";

describe("CreateAppointmentService", () => {
  it("should be able to create a new appointment", async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider: "JesusSaves",
      user_id: "1233",
    });

    expect(appointment).toHaveProperty("id");
    expect(appointment.provider_id).toBe("JesusSaves");
  });

  it("should not be able to create a two appointments on the same date", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 14); // ano, mes, dia e hora
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    await createAppointment.execute({
      date,
      provider: "JesusSaves",
      user_id: "1233",
    });

    await expect(
      createAppointment.execute({
        date,
        provider: "JesusSaves",
        user_id: "1233",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment on the past date", async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider: "123123",
        user_id: "123123c",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment with  same  user as provider", async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider: "userId",
        user_id: "userId",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment before 8am and after 5pm", async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider: "userId",
        user_id: "providerId",
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        provider: "userId",
        user_id: "providerId",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
