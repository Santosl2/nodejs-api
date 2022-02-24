import { compare } from "bcryptjs";
import { getRepository } from "typeorm";
import User from "../models/User";
import { sign } from "jsonwebtoken";
import { jwtConfig } from "../config/auth";
interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const findUser = await usersRepository.findOne({ where: { email } });

    if (!findUser) {
      throw new Error("Email ou senha incorretos.");
    }

    const passwordMatch = await compare(password, findUser.password || "");

    if (!passwordMatch) {
      throw new Error("Email ou senha incorretos.");
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
