import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserException {
  public static userWithThatCredentialsNotExist(): NotFoundException {
    return new NotFoundException('User with that credentials not exist!');
  }

  public static emailAlreadyInUse(): BadRequestException {
    return new BadRequestException('Email already in use!');
  }

  public static keyPairNotExist(): BadRequestException {
    return new BadRequestException(
      'Before first encryption you need to generate custom key pair!',
    );
  }
}
