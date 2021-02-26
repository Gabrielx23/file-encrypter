import { ApiProperty } from '@nestjs/swagger';

export class KeyPairDTO {
  @ApiProperty({ example: '-----BEGIN PUBLIC KEY-----MII...' })
  pubKey: string;

  @ApiProperty({ example: '-----BEGIN ENCRYPTED PRIVATE KEY-----MIIJrT ....' })
  privKey: string;

  constructor(publicKey: string, privateKey: string) {
    this.pubKey = publicKey;
    this.privKey = privateKey;
  }
}
