import { compare } from "bcryptjs";
import { getRepository } from "typeorm";
import User from "../models/User";
import { sign } from "jsonwebtoken";
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

    const token = sign({}, "6d1bd3fbc80d7f1d574f1c01ae5f888b", {
      subject: findUser.id,
      expiresIn: "1d",
    });

    return {
      user: findUser,
      token,
    };
  }
}

export { AuthenticateUserService };
