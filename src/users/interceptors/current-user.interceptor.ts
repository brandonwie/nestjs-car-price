import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const request = ctx.switchToHttp().getRequest();
    const { userId }: { userId: number } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOneById(userId);
      request.currentUser = user;
    }

    return next.handle();
  }
}
