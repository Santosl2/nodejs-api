import uploadConfig from "@config/upload";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import { Router } from "express";
import multer from "multer";
import UsersController from "../controllers/UsersController";
import UserAvatarController from "../controllers/UserAvatarController";

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post("/", new UsersController().create);

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  new UserAvatarController().update,
);

export default usersRouter;
