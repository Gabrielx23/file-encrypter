import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  private static users: Array<User> = [];

  public create(data: Partial<User>): User {
    const user = new User(data);

    UsersService.users.push(user);

    return user;
  }

  public getOneByEmail(email: string): User | null {
    const filtered = UsersService.users.filter(
      (user: User) => user.email === email,
    );

    return filtered.length > 0 ? filtered[0] : null;
  }

  public setPublicKey(user: User, publicKey: string): User {
    user.publicKey = publicKey;

    const filtered = UsersService.users.filter(
      (item: User) => item.email !== user.email,
    );

    filtered.push(user);

    UsersService.users = filtered;

    return user;
  }
}
