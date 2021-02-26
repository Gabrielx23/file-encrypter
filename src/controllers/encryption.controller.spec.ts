import { Test } from '@nestjs/testing';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { EncryptionService } from '../services/encryption.service';
import { EncryptionController } from './encryption.controller';
import { KeyPairDTO } from '../dto/key-pair.dto';

const usersServiceMock = () => ({
  setPublicKey: jest.fn(),
});

const encryptionServiceMock = () => ({
  generateKeyPair: jest.fn(),
});

const user = new User();

describe('EncryptionController', () => {
  let encryptionService: EncryptionService,
    usersService: UsersService,
    controller: EncryptionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: EncryptionService, useFactory: encryptionServiceMock },
        { provide: UsersService, useFactory: usersServiceMock },
      ],
    }).compile();

    encryptionService = await module.resolve(EncryptionService);
    usersService = await module.resolve(UsersService);
    controller = new EncryptionController(encryptionService, usersService);
  });

  describe('generateKeyPair', () => {
    const dto = new KeyPairDTO('pub', 'priv');

    it('uses encryption service to generate key pair', async () => {
      jest.spyOn(encryptionService, 'generateKeyPair').mockReturnValue(dto);

      await controller.generateKeyPair(user);

      expect(encryptionService.generateKeyPair).toHaveBeenCalled();
    });

    it('uses users service to update user public key', async () => {
      jest.spyOn(encryptionService, 'generateKeyPair').mockReturnValue(dto);

      await controller.generateKeyPair(user);

      expect(usersService.setPublicKey).toHaveBeenCalledWith(user, dto.pubKey);
    });

    it('returns generated key pair', async () => {
      jest.spyOn(encryptionService, 'generateKeyPair').mockReturnValue(dto);

      const result = await controller.generateKeyPair(user);

      expect(result).toEqual(dto);
    });
  });
});
