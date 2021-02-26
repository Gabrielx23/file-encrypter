import { Test } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { KeyPairDTO } from '../dto/key-pair.dto';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
    }).compile();

    service = new EncryptionService();
  });

  describe('generateKeyPair', () => {
    it('returns key pair dto', async () => {
      const result = await service.generateKeyPair();

      expect(result).toBeInstanceOf(KeyPairDTO);
    });
  });
});
