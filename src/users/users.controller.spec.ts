import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let authService: AuthService;
  let userRepo: Repository<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
  });

  it('modules should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('`signin()` returns a user and session.userId', async () => {
    userRepo.find = jest.fn().mockResolvedValue([aUser]);
    const session = { userId: null };
    const user = await controller.signin(
      {
        email: aUser.email,
        password: password,
      },
      session,
    );

    expect(user.id).toEqual(aUser.id);
    expect(session.userId).toEqual(aUser.id);
  });

  it('`findAllUsersByEmail()` returns a list of users', async () => {
    userRepo.find = jest.fn().mockResolvedValue([aUser]);

    const users = await controller.findUsersByEmail(aUser.email);

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(aUser.email);
  });

  it('`findUserById()` returns a single user with the given id', async () => {
    userRepo.findOne = jest.fn().mockResolvedValue(aUser);

    const user = controller.findUserById(aUser.id.toString());

    await expect(user).resolves.toEqual(aUser);
  });

  it('`findUserById()` throws an error if user with given id is not found', async () => {
    userRepo.findOne = jest.fn().mockResolvedValue(null);

    const user = controller.findUserById(aUser.id.toString());

    await expect(user).rejects.toThrow(NotFoundException);
  });
});
