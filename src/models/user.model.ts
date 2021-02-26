import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  @ApiProperty({ example: 'john.doe@hotmail.com' })
  email: string;

  @ApiProperty({ example: 'passpass' })
  @Exclude()
  password: string;

  @ApiProperty({ example: '-----BEGIN PUBLIC KEY-----MII...' })
  @Exclude()
  publicKey: string;

  constructor(data?: Partial<User>) {
    if (data) {
      this.email = data.email;
      this.password = data.password;
    }
  }
}
