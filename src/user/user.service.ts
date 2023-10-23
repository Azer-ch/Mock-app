import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
  async findAll() {
    const users = await this.model.find().exec();
    return users.map(
      (user) => new UserResponseDto(user.name, user.age, user.email),
    );
  }
  async findByEmail(email: string) {
    return await this.model
      .findOne({
        email: email,
      })
      .exec();
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }
  async createUser(user: User) {
    if (await this.model.exists({ email: user.email })) {
      throw new BadRequestException('User already exists');
    }
    const createdUser = await new this.model({
      ...user,
    }).save();
    return new UserResponseDto(
      createdUser.name,
      createdUser.age,
      createdUser.email,
    );
  }
}
