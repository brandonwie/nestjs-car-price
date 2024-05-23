import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { genSalt } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new ConflictException('email in use');
    }
    // Hash the user's password
    bcrypt.getSalt();

    // Create a new user and save it

    // Return the user
  }

  validate() {}
}
