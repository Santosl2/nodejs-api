import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import { SendForgotPasswordEmailService } from "./SendForgotPasswordEmailService";
import AppError from "@shared/errors/AppError";
import FakeUserTokensRepository from "../infra/typeorm/repositories/fakes/FakeUserTokensRepository";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotEmailService: SendForgotPasswordEmailService;

describe("SendForgotPasswordEmailService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it("should be able to recover the password using the email", async () => {
    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    await sendForgotEmailService.execute({
      email: "johndoe@gmail.com",
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to recover a non-existing user password", async () => {
    await expect(
      sendForgotEmailService.execute({
        email: "johndoe@gmail.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should generate a forgot password token", async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    await sendForgotEmailService.execute({
      email: "johndoe@gmail.com",
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
