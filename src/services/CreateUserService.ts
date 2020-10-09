import { getCustomRepository } from "typeorm";
import User from "../models/User";
import UsersRepository from "../repositories/UsersRepository";
import { hash } from 'bcryptjs'

interface CreateUserRequest {
  name: string,
  email: string,
  password:string,
}

class CreateUserService {
  private usersRepository : UsersRepository;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  public async execute({name, email, password }: CreateUserRequest) : Promise<User>{

    //Check if exist a user with same email address
    const findMail = await this.usersRepository.findOne({
      where: { email }
    })

    if (findMail)
      throw new Error('Email address already used.');

    const hashedPassword = await hash(password, 8);

    const newUser = this.usersRepository.create({name, password: hashedPassword, email});
    await this.usersRepository.save(newUser);
    
    return newUser;
  }
}

export default CreateUserService;