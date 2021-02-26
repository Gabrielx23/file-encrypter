import { UnauthorizedException } from '@nestjs/common';

export class AuthException {
  public static incorrectOrExpiredAuthorizationToken(): UnauthorizedException {
    return new UnauthorizedException(
      'Incorrect or expired authorization token.',
    );
  }

  public static authorizationTokenIsMissing(): UnauthorizedException {
    return new UnauthorizedException('Authorization token is missing!');
  }

  public static wrongAuthorizationTokenSignature(): UnauthorizedException {
    return new UnauthorizedException('Wrong authorization token signature!');
  }
}
