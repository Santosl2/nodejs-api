import { ListProvidersService } from "@modules/appointments/services/ListProvidersService";
import { Request, Response } from "express";
import { container } from "tsyringe";

class ProvidersController {
  public async index(request: Request, response: Response) {
    const userId = request.user.id;

    const listProvidersService = container.resolve(ListProvidersService);

    const providers = await listProvidersService.execute({
      user_id: userId,
    });

    return response.json(providers);
  }
}

export default ProvidersController;
