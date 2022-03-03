import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import { Router } from "express";
import ProvidersController from "../controllers/ProvidersController";

const providersRouter = Router();

providersRouter.use(ensureAuthenticated);

providersRouter.get("/", new ProvidersController().index);

export default providersRouter;
