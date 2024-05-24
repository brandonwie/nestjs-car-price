import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt, BinaryLike } from 'crypto'; // node built-in module
import { promisify } from 'util';
import { User } from './user.entity';

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

  async signup(email: string, password: string): Promise<User> {
    // See if email is in use
    const existingUser = await this.usersService.findByEmail(email);

    console.log(existingUser);

    if (existingUser.length > 0) {
      // RFC 7231 (Section 6.5.8):
      // The 409 (Conflict) status code indicates that the request could not be completed due to a conflict with the current state of the resource. This code is used in situations where the user might be able to resolve the conflict and resubmit the request.
      throw new ConflictException('Email in use');
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

  async signin(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);

    if (!user) {
      //RFC 7231 (Section 6.5.4):
      // The 404 (Not Found) status code indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = await scrypt(password, salt, 32);

    if (storedHash === hash.toString('hex')) {
      return user;
    } else {
      //RFC 7235 (Section 3.1):
      // The 401 (Unauthorized) status code indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
      throw new UnauthorizedException('Wrong password');
    }
  }
}
