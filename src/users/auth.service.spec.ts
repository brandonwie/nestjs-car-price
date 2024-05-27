import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let aUser: Partial<User>; // to omit the hooks
  const password = 'password';

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    // setup the user object
    const hashedPassword = await AuthService.hashPassword(password);
    aUser = {
      id: 1,
      email: 'test@email.com',
      password: hashedPassword,
    };
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();
    // only declare the methods that are used in the AuthService
    service = module.get(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  // Initializing all the dependencies for the AuthService
  describe('Initialize Dependencies', () => {
    it('can create an instance of auth service', async () => {
      expect(service).toBeDefined();
    });

    it('can create an instance of users service', async () => {
      expect(usersService).toBeDefined();
    });

    it('can create an instance of users repository', async () => {
      expect(userRepository).toBeDefined();
    });
  });

  describe('Sign Up User', () => {
    it('can create a new user with a salted and hashed password', async () => {
      usersService.findAllByEmail = jest.fn().mockResolvedValue([]);
      usersService.create = jest
        .fn()
        .mockImplementation((dto: CreateUserDto) => {
          return Promise.resolve({
            id: 1,
            email: dto.email,
            password: dto.password,
          });
        });

      const user = await service.signup(aUser.email, password);

      expect(user.password).not.toEqual(password);

      const [salt, hash] = user.password.split('.');

      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('should throw a conflict exception error if email is in use', async () => {
      usersService.findAllByEmail = jest.fn().mockResolvedValue([aUser]);

      await expect(service.signup(aUser.email, aUser.password)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Sign In User', () => {
    it('should throw a not found exception error if user is not found while signing in', async () => {
      usersService.findAllByEmail = jest.fn().mockResolvedValue([]);

      const signin = service.signin(aUser.email, password);

      await expect(signin).rejects.toThrow(NotFoundException);
    });

    it('should throw an unauthorized exception error if password is incorrect', async () => {
      usersService.findAllByEmail = jest.fn().mockResolvedValue([aUser]);

      const signin = service.signin(aUser.email, 'wrongPassword');

      await expect(signin).rejects.toThrow(UnauthorizedException);
    });

    it('should return the user if the password is correct', async () => {
      usersService.findAllByEmail = jest.fn().mockResolvedValue([aUser]);
      AuthService.comparePassword = jest.fn().mockResolvedValue(true);

      const user = await service.signin(aUser.email, aUser.password);

      expect(user).toEqual(aUser);
    });
  });
});
