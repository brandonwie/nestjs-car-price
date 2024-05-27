import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(dto: CreateUserDto): Promise<User> {
    const user = this.repo.create(dto);

    return this.repo.save(user);
  }

  async findOneById(id: number | null): Promise<User | null> {
    // if id is null, default behavior is to return the first user
    if (!id) {
      return null;
    }

    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  findAllByEmail(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // overwrite user with new attrs
    const updatedUser = Object.assign(user, attrs);
    // won't use update method because it doesn't trigger lifecycle hooks
    return this.repo.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // won't use delete method because it doesn't trigger lifecycle hooks
    this.repo.remove(user);
  }
}
