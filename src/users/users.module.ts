import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // creates repository
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      // set globally set interceptor
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
      // downside is that it will run on every request
      // that doesn't need the currentUser
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
