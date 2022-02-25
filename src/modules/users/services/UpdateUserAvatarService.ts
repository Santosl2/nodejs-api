import { inject, injectable } from "tsyringe";
import path from "path";
import fs from "fs";
import User from "../infra/typeorm/entities/User";
import upload from "@config/upload";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";

interface Request {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        "Apenas usuários autenticados tem acesso a essa rota.",
        401,
      );
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(upload.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export { UpdateUserAvatarService };
