import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import { AuthenticateUserService } from "./AuthenticateUserService";
import AppError from "@shared/errors/AppError";
import { CreateUserService } from "./CreateUserService";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

describe("AuthenticateUserService", () => {
  it("should be able to authenticate", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
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
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
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
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    expect(
      authenticateUserService.execute({
        email: "jesus@iscoming.com",
        password: "JesusSave",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
