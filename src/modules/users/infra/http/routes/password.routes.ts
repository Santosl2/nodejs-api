import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import ForgotPasswordController from "../controllers/ForgotPasswordController";
import ResetPasswordController from "../controllers/ResetPasswordController";

const passwordRouter = Router();

passwordRouter.post(
  "/forgot",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  new ForgotPasswordController().create,
);
passwordRouter.post(
  "/reset",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref("password")),
    },
  }),
  new ResetPasswordController().create,
);

export default passwordRouter;
