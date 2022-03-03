import FakeAppointmentRepository from "../infra/typeorm/repositories/fakes/FakeAppointmentsRepository";
import AppError from "@shared/errors/AppError";
import { ListProviderDayAvailabilityService } from "./ListProviderDayAvailabilityService";

let listProviderDayAvailability: ListProviderDayAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe("ListProviderDayAvailabilityService", () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it("should be able to list the day availability from provider", async () => {
    await fakeAppointmentRepository.create({
      provider_id: "user",
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "user",
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    const availables = await listProviderDayAvailability.execute({
      providerId: "user",
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availables).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});
