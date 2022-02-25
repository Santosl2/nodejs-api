import { parseISO } from "date-fns";
import { Router } from "express";
import { getCustomRepository } from "typeorm";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import AppointmentRepository from "../repositories/AppointmentsRepository";
import { CreateAppointmentService } from "../services/CreateAppointmentService";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get("/", async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const findAllAppointments = await appointmentsRepository.find();

  return response.json(findAllAppointments);
});

appointmentsRouter.post("/", async (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);
  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
