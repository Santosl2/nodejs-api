import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import { AuthenticateUserService } from "./AuthenticateUserService";
import AppError from "@shared/errors/AppError";
import { CreateUserService } from "./CreateUserService";

describe("AuthenticateUserService", () => {
  it("should be able to authenticate", async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
    );

    await createUser.execute({
      name: "Jesus",
      password: "JesusSave",
      email: "jesus@iscoming.com",
    });

    const response = await authenticateUserService.execute({
      email: "jesus@iscoming.com",
      password: "JesusSave",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to authenticate user if password is incorrect", async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
    );

    await createUser.execute({
      name: "Jesus",
      password: "JesusSave",
      email: "jesus@iscoming.com",
    });

    expect(
      authenticateUserService.execute({
        email: "jesus@iscoming.com",
        password: "",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate user if user not exists", async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
    );

    expect(
      authenticateUserService.execute({
        email: "jesus@iscoming.com",
        password: "JesusSave",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
