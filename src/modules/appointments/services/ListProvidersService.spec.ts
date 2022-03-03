import FakeUsersRepository from "@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository";
import { ListProvidersService } from "./ListProvidersService";

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe("ListProvidersService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it("should be able to list the providers", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "blablacar",
    });

    const user2 = await fakeUsersRepository.create({
      name: "John Doe 2",
      email: "johndoe2@gmail.com",
      password: "blablacar",
    });

    const loggedUser = await fakeUsersRepository.create({
      name: "Santosl2",
      email: "mfilype@gmail.com",
      password: "blablacar",
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user, user2]);
  });
});
