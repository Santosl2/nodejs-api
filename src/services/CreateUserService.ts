import { getRepository } from "typeorm";
import User from "../models/User";

interface Request {
  name: string;
  password: string;
  email: string;
}

class CreateUserService {
  public async execute({ name, password, email }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserEmailExists = await usersRepository.findOne({
      where: {
        email,
      },
    });

    if (checkUserEmailExists) {
      throw new Error("Endereço de e-mail já está em uso.");
    }

    const user = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(user);

    return user;
  }
}

export { CreateUserService };
