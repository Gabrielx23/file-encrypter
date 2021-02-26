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
import { UserException } from '../exceptions/user.exception';
import { SamplePdfClient } from '../clients/sample-pdf.client';

@ApiTags('Encryption')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller()
export class EncryptionController {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly usersService: UsersService,
    private readonly samplePdfClient: SamplePdfClient,
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

  @Post('encrypt')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  public async encryptSample(@LoggedUser() user: User): Promise<string> {
    if (!user.publicKey) {
      throw UserException.keyPairNotExist();
    }

    const samplePdf = await this.samplePdfClient.getSamplePDF();

    return this.encryptionService.encrypt(user.publicKey, samplePdf);
  }
}
