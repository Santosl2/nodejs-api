import uploadConfig from "@config/upload";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import { Router } from "express";
import multer from "multer";
import ProfileController from "../controllers/ProfileController";

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

const profileController = new ProfileController();

profileRouter.put("/", profileController.update);
profileRouter.get("/", profileController.show);

export default profileRouter;
