import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(
    params: CreateUserDto,
    profilePicture: Express.Multer.File,
  ): Promise<User> {
    const { email, password, username } = params;

    const userEmail = await this.userRepository.findOne({ email });

    if (userEmail)
      throw new ConflictException(`O email ${email} já está em uso.`);

    const hash = bcrypt.hashSync(password, 10);

    const userEntity = this.userRepository.create({
      email,
      username,
      password: hash,
      profilePicture: `/uploads/${profilePicture.filename}`,
    });

    try {
      const user = await this.userRepository.save(userEntity);

      return await this.findUserById(user.id);
    } catch (error) {
      throw new InternalServerErrorException("Não foi possível cadastrar o usuário.")
    }
    
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne(id, {
      select: ['id', 'email', 'username', 'profilePicture'],
    });
  }

  async findUserByIdWithPassword(id: string): Promise<User> {
    return await this.userRepository.findOne(id, {
      select: ['id', 'email', 'username', 'profilePicture', 'password'],
    });
  }

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'username', 'profilePicture'],
    });
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async update(
    updateUserDto: UpdateUserDto,
    user: User,
    profilePicture: Express.Multer.File,
  ) {
    user.username = updateUserDto.username
      ? updateUserDto.username
      : user.username;

    if (updateUserDto.password) {
      const hash = bcrypt.hashSync(updateUserDto.password, 10);
      user.password = hash;
    } else {
      user.password = user.password;
    }

    user.email = updateUserDto.email ? updateUserDto.email : user.email;

    user.profilePicture = profilePicture
      ? `/uploads/${profilePicture.filename}`
      : user.profilePicture;

    try {
      await this.userRepository.save(user);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Não foi possível atualizar os dados do usuário.',
      );
    }
  }
}
