import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import ProviderDayAvailabilityController from "../controllers/ProviderDayAvailabilityController";
import ProviderMonthAvailabilityController from "../controllers/ProviderMonthAvailabilityController";
import ProvidersController from "../controllers/ProvidersController";

const providersRouter = Router();

providersRouter.use(ensureAuthenticated);

providersRouter.get("/", new ProvidersController().index);
providersRouter.get(
  "/:provider_id/month-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),

  new ProviderMonthAvailabilityController().index,
);
providersRouter.get(
  "/:provider_id/day-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  new ProviderDayAvailabilityController().index,
);

export default providersRouter;
