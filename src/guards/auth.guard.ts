import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { AuthException } from '../exceptions/auth.exception';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw AuthException.authorizationTokenIsMissing();
    }

    const payload = await this.authService.decodeToken(token);
    const user = await this.usersService.getOneByEmail(payload.email);

    if (!user) {
      throw AuthException.wrongAuthorizationTokenSignature();
    }

    request.user = user;

    return true;
  }
}
