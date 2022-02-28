import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import { inject, injectable } from "tsyringe";
import IUsersRepository from "../repositories/IUsersRepository";
import AppError from "@shared/errors/AppError";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("E-mail inexistente.");
    }

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(email, "Hello world tdd");
  }
}

export { SendForgotPasswordEmailService };
