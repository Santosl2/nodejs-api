import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import { CreateUserService } from "./CreateUserService";
import AppError from "@shared/errors/AppError";

describe("CreateUserService", () => {
  it("should be able to create a new user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      name: "Jesus",
      password: "JesusSave",
      email: "jesus@iscoming.com",
    });

    expect(user).toHaveProperty("id");
    expect(user.name).toBe("Jesus");
  });

  it("should not be able to create a new user on the same email", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

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
