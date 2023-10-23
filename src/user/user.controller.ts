import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUser() {
    return await this.userService.findAll();
  }
  @Get('email')
  async getUserByEmail(@Body('email') email: string) {
    return await this.userService.findByEmail(email);
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }
  @Post()
  async createUser(@Body('user') user: User) {
    return await this.userService.createUser(user);
  }
}
