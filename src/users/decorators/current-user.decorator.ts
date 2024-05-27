import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// param decorator doesn't have access to the DI system
// so the decorator can't get instance of UsersService directly
// therefore, we create interceptor, which is responsible for getting the user from the UsersService
export const CurrentUser = createParamDecorator(
  // data is the value passed to the decorator
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('session: ', request.session);
    // current-user.interceptor.ts will inject `currentUser` into the request object
    return request.currentUser;
  },
);
