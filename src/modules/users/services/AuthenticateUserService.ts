import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import AppError from "@shared/errors/AppError";
import { jwtConfig } from "@config/auth";
import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUsersRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const findUser = await this.usersRepository.findByEmail(email);

    if (!findUser) {
      throw new AppError("Email ou senha incorretos.", 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      findUser.password || "",
    );

    if (!passwordMatch) {
      throw new AppError("Email ou senha incorretos.", 401);
    }

    delete findUser.password;

    const { secret, expiresIn } = jwtConfig;

    const token = sign({}, secret, {
      subject: findUser.id,
      expiresIn: expiresIn,
    });

    return {
      user: findUser,
      token,
    };
  }
}

export { AuthenticateUserService };
