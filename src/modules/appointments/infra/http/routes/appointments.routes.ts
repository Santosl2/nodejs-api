import { CreateAppointmentService } from "@modules/appointments/services/CreateAppointmentService";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import { parseISO } from "date-fns";
import { Router } from "express";
import { container } from "tsyringe";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get("/", async (request, response) => {
//   const appointmentsRepository = getCustomRepository(AppointmentRepository);
//   const findAllAppointments = await appointmentsRepository.find();

//   return response.json(findAllAppointments);
// });

appointmentsRouter.post("/", async (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);
  const createAppointment = container.resolve(CreateAppointmentService);

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
