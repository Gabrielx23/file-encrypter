import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { EnvKeyEnum } from '../enum/env-key.enum';
import { AuthDTO } from '../dto/auth.dto';

const configServiceMock = () => ({
  get: jest.fn(),
});

const user = new User({ email: 'test@test.pl' });

describe('AuthService', () => {
  let service: AuthService, config: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useFactory: configServiceMock }],
    }).compile();

    config = await module.get(ConfigService);
    service = new AuthService(config);
  });

  describe('login', () => {
    it('uses config service to obtain all required env data', async () => {
      jest.spyOn(config, 'get').mockReturnValue('60');

      await service.login(user);

      expect(config.get).toHaveBeenCalledWith(EnvKeyEnum.JWTSecretKey);
      expect(config.get).toHaveBeenCalledWith(EnvKeyEnum.JWTExpiresIn);
      expect(config.get).toHaveBeenCalledWith(EnvKeyEnum.JWTExpiresInUnit);
    });

    it('returns auth dto', async () => {
      jest.spyOn(config, 'get').mockReturnValue('60');

      const result = await service.login(user);

      expect(result).toBeInstanceOf(AuthDTO);
    });
  });

  describe('decodeToken', () => {
    const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: 60 });

    it('obtains refresh token secret', async () => {
      jest.spyOn(config, 'get').mockReturnValue('secret');

      await service.decodeToken(token);

      expect(config.get).toHaveBeenCalledWith(EnvKeyEnum.JWTSecretKey);
    });

    it('returns decoded payload if token is correct', async () => {
      jest.spyOn(config, 'get').mockReturnValue('secret');

      const result = await service.decodeToken(token);

      expect(result.email).toEqual(user.email);
    });

    it('throws unauthorized exception if token is incorrect', async () => {
      jest.spyOn(config, 'get').mockReturnValue('secret');

      await expect(service.decodeToken('bad')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
