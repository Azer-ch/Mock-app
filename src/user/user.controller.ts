import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUser() {
    return await this.userService.findAll();
  }
  @Get('name')
  async getUsersByName(@Body('name') name: string) {
    return await this.userService.findByName(name);
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }
  @Post()
  async createUser(@Body('user') user: CreateUserDto) {
    return await this.userService.createUser(user);
  }
}
