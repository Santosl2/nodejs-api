import { SendForgotPasswordEmailService } from "@modules/users/services/SendForgotPasswordEmailService";
import { container } from "tsyringe";
import { Request, Response } from "express";
import { UpdateProfileService } from "@modules/users/services/UpdateProfileService";
import { ShowProfileService } from "@modules/users/services/ShowProfileService";

class ProfileController {
  public async show(request: Request, response: Response) {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    delete user.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response) {
    const user_id = request.user.id;
    const { name, email, password, oldPassword } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      email,
      name,
      password,
      oldPassword,
    });

    delete user.password;

    return response.status(204).json();
  }
}

export default ProfileController;
