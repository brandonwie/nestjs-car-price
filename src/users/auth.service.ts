import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt, BinaryLike } from 'crypto'; // node built-in module
import { promisify } from 'util';

const scrypt: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
) => Promise<Buffer> = promisify<BinaryLike, BinaryLike, number, Buffer>(
  _scrypt,
);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('email in use');
    }
    // Hash the user's password
    // Generate a salt
    // - randomBytes generates a buffer of random bytes
    const salt = randomBytes(8).toString('hex');

    // Hash teh salt and the password together
    const hash = await scrypt(password, salt, 32);
    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = this.usersService.create({
      email: email,
      password: result,
    });

    // Return the user
    return user;
  }

  validate() {}
}
