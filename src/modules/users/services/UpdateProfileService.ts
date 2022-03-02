import { inject, injectable } from "tsyringe";
import User from "../infra/typeorm/entities/User";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";
import IUploadProvider from "@shared/container/providers/UploadProvider/models/IUploadProvider";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface Request {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    email,
    name,
    password,
    oldPassword,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError("E-mail já em uso.");
    }

    user.name = name;
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError(
        "Por favor, informe a senha antiga para atualizar a senha atual.",
      );
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user?.password || "",
      );

      if (!checkOldPassword) {
        throw new AppError("A senha antiga está incorreta.");
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export { UpdateProfileService };
