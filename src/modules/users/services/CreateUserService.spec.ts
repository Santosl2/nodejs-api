import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import { CreateUserService } from "./CreateUserService";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe("CreateUserService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it("should be able to create a new user", async () => {
    const user = await createUser.execute({
      name: "Jesus",
      password: "JesusSave",
      email: "jesus@iscoming.com",
    });

    expect(user).toHaveProperty("id");
    expect(user.name).toBe("Jesus");
  });

  it("should not be able to create a new user on the same email", async () => {
    await createUser.execute({
      name: "Jesus",
      password: "JesusSave",
      email: "jesus@iscoming.com",
    });

    expect(
      createUser.execute({
        name: "Mateus11:28",
        password: "JesusSave",
        email: "jesus@iscoming.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
