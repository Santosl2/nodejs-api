import { SendForgotPasswordEmailService } from "@modules/users/services/SendForgotPasswordEmailService";
import { container } from "tsyringe";
import { Request, Response } from "express";

class ForgotPasswordController {
  public async create(request: Request, response: Response) {
    const { email } = request.body;

    const sendForgotPassword = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPassword.execute({
      email,
    });

    return response.status(204).json();
  }
}

export default ForgotPasswordController;
