import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { EncryptionService } from '../services/encryption.service';
import { AuthGuard } from '../guards/auth.guard';
import { KeyPairDTO } from '../dto/key-pair.dto';
import { LoggedUser } from '../decorators/logged-user.decorator';
import { User } from '../models/user.model';

@ApiTags('Encryption')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller()
export class EncryptionController {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly usersService: UsersService,
  ) {}

  @Post('generate-key-pair')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ type: KeyPairDTO })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  public generateKeyPair(@LoggedUser() user: User): KeyPairDTO {
    const keys = this.encryptionService.generateKeyPair();

    this.usersService.setPublicKey(user, keys.pubKey);

    return keys;
  }
}
