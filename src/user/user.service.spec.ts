import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';

const mockUser: UserResponseDto = {
  name: 'User',
  email: 'user@user.com',
  age: 4,
};

describe('UsersService', () => {
  let service: UserService;
  let model: Model<User>;

  const usersArray: UserResponseDto[] = [
    {
      name: 'User #1',
      email: 'user1@user.com',
      age: 4,
    },
    {
      name: 'User #2',
      email: 'user2@user.com',
      age: 4,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersArray),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(usersArray);
  });

  it('should create a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        name: 'User',
        email: 'user@user.com',
        age: 4,
      } as any),
    );
    const newUser = await service.createUser({
      name: 'User',
      email: 'user@user.com',
      age: 4,
    });
    expect(newUser).toEqual(mockUser);
  });
});
