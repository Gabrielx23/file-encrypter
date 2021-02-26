import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
    }).compile();

    service = new UsersService();
  });

  describe('create', () => {
    const partial = { email: 'test@test.pl' };
    const user = new User(partial);

    it('creates and stores user from given data', async () => {
      await service.create(partial);

      expect(service.getOneByEmail(partial.email)).toEqual(user);
    });

    it('returns created user', async () => {
      const result = await service.create(partial);

      expect(result).toEqual(user);
    });
  });

  describe('getOneByEmail', () => {
    const partial = { email: 'test@test.pl' };
    const user = new User(partial);

    it('returns user obtained by email', async () => {
      await service.create(partial);

      const result = await service.getOneByEmail(user.email);

      expect(result).toEqual(user);
    });

    it('returns null if user by email not exist', async () => {
      const result = await service.getOneByEmail('test2@test.pl');

      expect(result).toBeNull();
    });
  });

  describe('setPublicKey', () => {
    const partial = { email: 'key@test.pl' };
    const user = new User(partial);

    it('updates given user public key value', async () => {
      await service.create(partial);

      await service.setPublicKey(user, 'pub key');

      const result = await service.getOneByEmail(user.email);

      expect(result.publicKey).toEqual('pub key');
    });

    it('returns user with updated public key', async () => {
      await service.create(partial);

      const result = await service.setPublicKey(user, 'pub key');

      expect(result).toEqual(user);
    });
  });
});
