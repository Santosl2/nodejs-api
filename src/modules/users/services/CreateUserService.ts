import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";
import AppError from "@shared/errors/AppError";
import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUsersRepository";

interface Request {
  name: string;
  password: string;
  email: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, password, email }: Request): Promise<User> {
    const checkUserEmailExists = await this.usersRepository.findByEmail(email);

    if (checkUserEmailExists) {
      throw new AppError("Endereço de e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export { CreateUserService };
