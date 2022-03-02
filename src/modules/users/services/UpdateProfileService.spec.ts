import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import { UpdateProfileService } from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("UpdateProfileService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it("should be able to update a user avatar", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "blablacar",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Tre",
      email: "johntre@gmail.com",
    });

    expect(updatedUser.name).toBe("John Tre");
    expect(updatedUser.email).toBe("johntre@gmail.com");
  });

  it("should not be able to change email if email already exists", async () => {
    await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "blablacar",
    });

    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "johndoe3@gmail.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Wick",
        email: "johndoe@gmail.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "johndoe3@gmail.com",
      password: "123456",
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: "John Wick",
      email: "johndoe@gmail.com",
      password: "123123",
      oldPassword: "123456",
    });

    expect(updateUser.password).toBe("123123");
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "johndoe3@gmail.com",
      password: "123456",
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Wick",
        email: "johndoe@gmail.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "johndoe3@gmail.com",
      password: "123456",
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: "John Wick",
        email: "johndoe@gmail.com",
        oldPassword: "wrong-old-password",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the profile from non-existing user", async () => {
    await expect(
      updateProfile.execute({
        user_id: "non-existing-userid",
        name: "test",
        email: "teste@gmail.com",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
