import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// Satisfies all the requirements of the NestInterceptor interface
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // context has incoming message, server response, next function
    // and constructorRef(what class is being used in the controller), handler, contextType(http, graphql, rpc, ws)

    // the next.handle() returns an Observable representing the response stream from the route handler.

    return next.handle().pipe(
      map((data: typeof this.dto) => {
        console.log({ data });
        // data is the Entity that is being returned from the handler
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // only include properties that are defined in the DTO
        });
      }),
    );
  }
}
