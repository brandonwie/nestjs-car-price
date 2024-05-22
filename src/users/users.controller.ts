import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
// dto
// validation dto
// import dto
// import to main.ts

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body);
  }

  @Delete('/delete')
  async deleteUser(@Body('id') id: number) {
    const res = await this.usersService.delete(id);
    console.log(res);
  }

  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findOneById(parseInt(id));
  }

  @Get('/user')
  async findUsersByEmail(@Body('email') email: string) {
    const res = await this.usersService.findByEmail(email);
    console.log(res);
  }
}
