import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
  async findAll() {
    const users = await this.model.find().exec();
    return users.map(
      (user) => new UserResponseDto(user.name, user.age, user.email),
    );
  }
  async findByName(name: string) {
    const users = await this.model
      .find({
        name,
      })
      .exec();
    return users.map(
      (user) => new UserResponseDto(user.name, user.age, user.email),
    );
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }
  async createUser(user: CreateUserDto) {
    const createdUser = await this.model.create(user);
    return new UserResponseDto(
      createdUser.name,
      createdUser.age,
      createdUser.email,
    );
  }
}
