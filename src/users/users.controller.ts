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
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
// dto
// validation dto
// import dto
// import to main.ts

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body);
  }

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findOneById(parseInt(id));
  }

  @Get()
  findUsersByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    // TODO handle error
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
