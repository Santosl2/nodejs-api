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
      user_id: "1233",

      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "user",
      user_id: "1233",
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
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
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
