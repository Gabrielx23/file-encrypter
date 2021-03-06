import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { KeyPairDTO } from '../dto/key-pair.dto';

@Injectable()
export class EncryptionService {
  public generateKeyPair(): KeyPairDTO {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: '',
      },
    });

    return new KeyPairDTO(publicKey, privateKey);
  }

  public encrypt(publicKey: string, data: string): string {
    const buffer = new Buffer(data, 'base64');

    const encrypted = crypto.publicEncrypt(publicKey, buffer);

    return encrypted.toString();
  }
}
