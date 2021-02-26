import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AuthDTO } from '../dto/auth.dto';
import { EnvKeyEnum } from '../enum/env-key.enum';
import { AuthTokenPayloadDTO } from '../dto/auth-token-payload.dto';
import { AuthException } from '../exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  public async decodeToken(token: string): Promise<AuthTokenPayloadDTO | any> {
    const secret = this.configService.get(EnvKeyEnum.JWTSecretKey);

    token = token.replace('Bearer ', '');

    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw AuthException.incorrectOrExpiredAuthorizationToken();
    }
  }

  public async login(user: User): Promise<AuthDTO> {
    const secret = this.configService.get(EnvKeyEnum.JWTSecretKey);
    const expiresIn = this.configService.get(EnvKeyEnum.JWTExpiresIn);
    const expiresInUnit = this.configService.get(EnvKeyEnum.JWTExpiresInUnit);

    const authDTO = new AuthDTO();

    authDTO.authToken = jwt.sign({ email: user.email }, secret, {
      expiresIn: expiresIn + expiresInUnit,
    });

    authDTO.tokenExpiresIn = expiresIn + expiresInUnit;

    return authDTO;
  }
}
