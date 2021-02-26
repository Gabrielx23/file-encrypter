import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthDTO } from '../dto/auth.dto';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { PasswordsService } from '../services/passwords.service';
import { UsersService } from '../services/users.service';
import { SignUpDTO } from '../dto/sign-up.dto';
import { SignInDTO } from '../dto/sign-in.dto';

const usersServiceMock = () => ({
  getOneByEmail: jest.fn(),
  create: jest.fn(),
});

const passwordServiceMock = () => ({
  verify: jest.fn(),
  hash: jest.fn(),
});

const authServiceMock = () => ({
  decodeToken: jest.fn(),
  login: jest.fn(),
});

const user = new User();

describe('AuthController', () => {
  let authService: AuthService,
    passwordsService: PasswordsService,
    usersService: UsersService,
    controller: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useFactory: authServiceMock },
        { provide: PasswordsService, useFactory: passwordServiceMock },
        { provide: UsersService, useFactory: usersServiceMock },
      ],
    }).compile();

    authService = await module.resolve(AuthService);
    passwordsService = await module.resolve(PasswordsService);
    usersService = await module.get(UsersService);
    controller = new AuthController(
      usersService,
      authService,
      passwordsService,
    );
  });

  describe('signUp', () => {
    const dto = new SignUpDTO();
    dto.email = 'test@test.pl';
    dto.password = 'password';

    it('throws an exception if an email is already in use', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockReturnValue(user);

      await expect(controller.signUp(dto)).rejects.toThrow(BadRequestException);
    });

    it('uses passwords service to hash user password', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockReturnValue(null);

      await controller.signUp(dto);

      expect(passwordsService.hash).toHaveBeenCalledWith(dto.password);
    });

    it('uses users service to create user with given data', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockReturnValue(null);
      jest.spyOn(passwordsService, 'hash').mockResolvedValue('hashed');

      const partial = { ...dto, password: 'hashed' };

      await controller.signUp(dto);

      expect(usersService.create).toHaveBeenCalledWith(partial);
    });
  });

  describe('signIn', () => {
    const dto = new SignInDTO();
    dto.email = 'test@test.pl';
    dto.password = 'password';

    it('uses users service to obtain user by email and throws exception if user not exist', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockReturnValue(null);

      await expect(controller.signIn(dto)).rejects.toThrow(NotFoundException);

      expect(usersService.getOneByEmail).toHaveBeenCalledWith(dto.email);
    });

    it('throws exception if user password does not match', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockReturnValue(user);
      jest.spyOn(passwordsService, 'verify').mockResolvedValue(false);

      await expect(controller.signIn(dto)).rejects.toThrow(NotFoundException);

      expect(passwordsService.verify).toHaveBeenCalledWith(
        dto.password,
        user.password,
      );
    });

    it('uses auth service to sign in user and returns it result', async () => {
      jest.spyOn(usersService, 'getOneByEmail').mockReturnValue(user);
      jest.spyOn(passwordsService, 'verify').mockResolvedValue(true);
      jest.spyOn(authService, 'login').mockResolvedValue(new AuthDTO());

      const result = await controller.signIn(dto);

      expect(result).toEqual(new AuthDTO());
      expect(authService.login).toHaveBeenCalledWith(user);
    });
  });
});
