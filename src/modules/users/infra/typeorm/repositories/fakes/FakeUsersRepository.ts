import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import User from "../../entities/User";
import { v4 as uuid } from "uuid";
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(
      user,
      {
        id: uuid(),
      },
      userData,
    );

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findUserIndex = this.users.findIndex(
      findUser => findUser.id === user.id,
    );

    this.users[findUserIndex] = user;

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);

    return user;
  }

  public async findAllProviders({
    exceptUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (exceptUserId) {
      users = this.users.filter(user => user.id !== exceptUserId);
    }

    return users;
  }
}

export default FakeUsersRepository;
