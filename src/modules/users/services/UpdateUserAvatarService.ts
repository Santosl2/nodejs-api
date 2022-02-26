import { inject, injectable } from "tsyringe";
import path from "path";
import fs from "fs";
import User from "../infra/typeorm/entities/User";
import upload from "@config/upload";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import IUploadProvider from "@shared/container/providers/UploadProvider/models/IUploadProvider";

interface Request {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UploadProvider")
    private uploadProvider: IUploadProvider,
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
      await this.uploadProvider.deleteFile(user.avatar);
    }

    const fileName = await this.uploadProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export { UpdateUserAvatarService };
