import AppError from "@shared/errors/AppError";

import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserAvatarService } from "@modules/users/services/UpdateUserAvatarService";

class UserAvatarController {
  public async update(request: Request, response: Response) {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    if (!request.file) throw new AppError("Oops, você se esqueceu da imagem.");

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete user?.password;
  }
}

export default UserAvatarController;
