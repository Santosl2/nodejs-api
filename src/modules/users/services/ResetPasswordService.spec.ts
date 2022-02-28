import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../infra/typeorm/repositories/fakes/FakeUserTokensRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import { ResetPasswordService } from "./ResetPasswordService";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;

describe("ResetPasswordService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it("should be able to reset the password ", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    await resetPassword.execute({
      password: "123123",
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith("123123");
    expect(updatedUser?.password).toBe("123123");
  });

  it("should not be able to reset the password with non-existing token", async () => {
    const { token } = await fakeUserTokensRepository.generate("111111477");

    await expect(
      resetPassword.execute({
        token,
        password: "oloquinhomeu",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing token", async () => {
    await expect(
      resetPassword.execute({
        token: "111111477",
        password: "oloquinhomeu",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset password with passed more than 2h ", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: "123123",
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
