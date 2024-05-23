import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// Satisfies all the requirements of the NestInterceptor interface
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<any>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // context has incoming message, server response, next function
    // and constructorRef(what class is being used in the controller), handler, contextType(http, graphql, rpc, ws)

    // the next.handle() returns an Observable representing the response stream from the route handler.

    return next.handle().pipe(
      map((data) => {
        // the `data` here is the return value from the route handler (if User entity is returned, it will be the User entity)
        console.log({ data });
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // only include properties that are defined in the DTO
        });
      }),
      // the `data below is the return value of the previous operator function (so the return value of `plainToInstance()` )
      // map((data) => {
      //   console.log({ data });
      //   return { data };
      // }),
    );
  }
}
