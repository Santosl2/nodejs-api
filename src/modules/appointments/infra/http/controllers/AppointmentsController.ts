import { parseISO } from "date-fns";
import { CreateAppointmentService } from "@modules/appointments/services/CreateAppointmentService";
import { container } from "tsyringe";
import { Request, Response } from "express";

class AppointmentsController {
  public async create(request: Request, response: Response) {
    const userId = request.user.id;
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);
    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider,
      user_id: userId,
    });

    return response.json(appointment);
  }
}

export default AppointmentsController;
