import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { EntityRepository, getRepository, Not, Repository } from "typeorm";
import User from "../entities/User";

@EntityRepository(User)
class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const User = this.ormRepository.create(userData);

    await this.ormRepository.save(User);

    return User;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findAllProviders({
    exceptUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users = await this.ormRepository.find();

    if (exceptUserId) {
      users = await this.ormRepository.find({
        where: { id: Not(exceptUserId) },
      });
    }

    return users;
  }
}

export default UsersRepository;
