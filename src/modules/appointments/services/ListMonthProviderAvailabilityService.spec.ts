import FakeAppointmentRepository from "../infra/typeorm/repositories/fakes/FakeAppointmentsRepository";
import AppError from "@shared/errors/AppError";
import { ListMonthProviderAvailabilityService } from "./ListMonthProviderAvailabilityService";

let listMonthProviderAvailabilityService: ListMonthProviderAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe("ListMonthProviderAvailabilityService", () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    listMonthProviderAvailabilityService =
      new ListMonthProviderAvailabilityService(fakeAppointmentRepository);
  });

  it("should be able to list the month availability from provider", async () => {
    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 9, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 11, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 12, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 13, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 15, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 16, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 20, 17, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "oloco",
      date: new Date(2020, 8, 21, 10, 0, 0),
    });

    const availability = await listMonthProviderAvailabilityService.execute({
      providerId: "oloco",
      year: 2020,
      month: 9,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
