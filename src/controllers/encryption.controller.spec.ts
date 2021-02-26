import { Test } from '@nestjs/testing';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { EncryptionService } from '../services/encryption.service';
import { EncryptionController } from './encryption.controller';
import { KeyPairDTO } from '../dto/key-pair.dto';
import { SamplePdfClient } from '../clients/sample-pdf.client';
import { BadRequestException } from '@nestjs/common';

const usersServiceMock = () => ({
  setPublicKey: jest.fn(),
});

const samplePdfClientMock = () => ({
  getSamplePDF: jest.fn(),
});

const encryptionServiceMock = () => ({
  generateKeyPair: jest.fn(),
  encrypt: jest.fn(),
});

const user = new User();

describe('EncryptionController', () => {
  let encryptionService: EncryptionService,
    usersService: UsersService,
    client: SamplePdfClient,
    controller: EncryptionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: EncryptionService, useFactory: encryptionServiceMock },
        { provide: UsersService, useFactory: usersServiceMock },
        { provide: SamplePdfClient, useFactory: samplePdfClientMock },
      ],
    }).compile();

    encryptionService = await module.resolve(EncryptionService);
    usersService = await module.resolve(UsersService);
    client = await module.resolve(SamplePdfClient);
    controller = new EncryptionController(
      encryptionService,
      usersService,
      client,
    );
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

  describe('encryptSample', () => {
    it('throws exception if user do not have public key', async () => {
      await expect(controller.encryptSample(user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('uses pdf client to obtain sample pdf', async () => {
      jest.spyOn(client, 'getSamplePDF').mockResolvedValue('pdf');

      user.publicKey = 'pub';

      await controller.encryptSample(user);

      expect(client.getSamplePDF).toHaveBeenCalled();
    });

    it('uses encryption service to encrypt pdf with given public key', async () => {
      jest.spyOn(client, 'getSamplePDF').mockResolvedValue('pdf');

      user.publicKey = 'pub';

      await controller.encryptSample(user);

      expect(encryptionService.encrypt).toBeCalledWith(user.publicKey, 'pdf');
    });

    it('returns encrypted pdf', async () => {
      jest.spyOn(encryptionService, 'encrypt').mockReturnValue('encrypted pdf');
      jest.spyOn(client, 'getSamplePDF').mockResolvedValue('pdf');

      const result = await controller.encryptSample(user);

      expect(result).toEqual('encrypted pdf');
    });
  });
});
