import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    // only declare the methods that are used in the AuthService

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

    service = module.get(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  // Initializing all the dependencies for the AuthService
  describe('initialize dependencies', () => {
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

  describe('CRUD User', () => {
    it('creates a new user with a salted and hashed password', async () => {
      usersService.findAllByEmail = jest.fn().mockResolvedValue([]);
      usersService.create = jest.fn().mockImplementation((dto) => {
        return Promise.resolve({
          id: 1,
          email: dto.email,
          password: dto.password,
        });
      });

      const user = await service.signup('asdf@asdf.com', 'asdf');

      console.log(user);

      expect(user.password).not.toEqual('asdf');

      const [salt, hash] = user.password.split('.');

      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('should not create a user if email already exists', async () => {
      const user = {
        email: 'existing@email.com',
        password: 'password',
      };
      usersService.findAllByEmail = jest.fn().mockResolvedValue([user]);

      await expect(service.signup(user.email, user.password)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
