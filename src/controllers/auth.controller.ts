import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { PasswordsService } from '../services/passwords.service';
import { AuthService } from '../services/auth.service';
import { SignUpDTO } from '../dto/sign-up.dto';
import { AuthDTO } from '../dto/auth.dto';
import { SignInDTO } from '../dto/sign-in.dto';
import { UserException } from '../exceptions/user.exception';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly passwordService: PasswordsService,
  ) {}

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async signUp(@Body() dto: SignUpDTO): Promise<void> {
    const userByEmail = this.usersService.getOneByEmail(dto.email);

    if (userByEmail) {
      throw UserException.emailAlreadyInUse();
    }

    const password = await this.passwordService.hash(dto.password);

    await this.usersService.create({ ...dto, password });
  }

  @Post('sign-in')
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ type: AuthDTO })
  @ApiBadRequestResponse()
  public async signIn(@Body() dto: SignInDTO): Promise<AuthDTO> {
    const user = await this.usersService.getOneByEmail(dto.email);

    if (
      !user ||
      !(await this.passwordService.verify(dto.password, user.password))
    ) {
      throw UserException.userWithThatCredentialsNotExist();
    }

    return await this.authService.login(user);
  }
}
