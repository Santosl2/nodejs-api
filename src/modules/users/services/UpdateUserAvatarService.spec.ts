import FakeUsersRepository from "../infra/typeorm/repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import FakeDiskUploadProvider from "@shared/container/providers/UploadProvider/fakes/FakeUploadProvider";
import { UpdateUserAvatarService } from "./UpdateUserAvatarService";

let fakeUsersRepository: FakeUsersRepository;
let fakeDiskUploadProvider: FakeDiskUploadProvider;
let uploadUserAvatar: UpdateUserAvatarService;

describe("UpdateUserAvatar", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDiskUploadProvider = new FakeDiskUploadProvider();

    uploadUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeDiskUploadProvider,
    );
  });

  it("should be able to update a user avatar", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "blablacar",
    });

    await uploadUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "johndoe.png",
    });

    expect(user.avatar).toBe("johndoe.png");
  });

  it("should delete old avatar when updating new one", async () => {
    const deleteFile = jest.spyOn(fakeDiskUploadProvider, "deleteFile");

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "blablacar",
    });

    await uploadUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "johndoe.png",
    });

    await uploadUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "johndoe2.png",
    });

    expect(deleteFile).toHaveBeenCalledWith("johndoe.png");
    expect(user.avatar).toBe("johndoe2.png");
  });

  it("should not be able to update a user avatar if user not exists", async () => {
    expect(
      uploadUserAvatar.execute({
        user_id: "johndoe",
        avatarFileName: "johndoe.png",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
