import { ListProviderDayAvailabilityService } from "@modules/appointments/services/ListProviderDayAvailabilityService";
import { ListProvidersService } from "@modules/appointments/services/ListProvidersService";
import { Request, Response } from "express";
import { container } from "tsyringe";

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response) {
    const { provider_id } = request.params;
    const { month, year, day } = request.body;

    const listProvidersDayService = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const providers = await listProvidersDayService.execute({
      providerId: provider_id,
      month,
      year,
      day,
    });

    return response.json(providers);
  }
}

export default ProviderDayAvailabilityController;
