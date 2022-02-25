import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import { Router } from "express";
import AppointmentsController from "../controllers/AppointmentsController";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get("/", async (request, response) => {
//   const appointmentsRepository = getCustomRepository(AppointmentRepository);
//   const findAllAppointments = await appointmentsRepository.find();

//   return response.json(findAllAppointments);
// });

appointmentsRouter.post("/", new AppointmentsController().create);

export default appointmentsRouter;
