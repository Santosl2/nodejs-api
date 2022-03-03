import { ListMonthProviderAvailabilityService } from "@modules/appointments/services/ListMonthProviderAvailabilityService";
import { Request, Response } from "express";
import { container } from "tsyringe";

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response) {
    const { provider_id } = request.params;
    const { month, year } = request.body;

    const listProvidersMonthService = container.resolve(
      ListMonthProviderAvailabilityService,
    );

    const providers = await listProvidersMonthService.execute({
      providerId: provider_id,
      month,
      year,
    });

    return response.json(providers);
  }
}

export default ProviderMonthAvailabilityController;
