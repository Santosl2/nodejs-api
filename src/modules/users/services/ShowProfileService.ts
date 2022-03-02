import { inject, injectable } from "tsyringe";
import User from "../infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import IUploadProvider from "@shared/container/providers/UploadProvider/models/IUploadProvider";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface Request {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    return user;
  }
}

export { ShowProfileService };
