import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import { AuthenticateUserService } from "./AuthenticateUserService";
import AppError from "@shared/errors/AppError";
import { CreateUserService } from "./CreateUserService";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe("AuthenticateUserService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it("should be able to authenticate", async () => {
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
    expect(
      authenticateUserService.execute({
        email: "jesus@iscoming.com",
        password: "JesusSave",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
