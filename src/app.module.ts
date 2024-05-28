import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_NAME'),
        entities: [User, Report],
        synchronize: true, // only for development
      }),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true, // only for development
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // NOTE: ValidationPipe is moved from main.ts
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // strip out any fields that do not have a corresponding property in the DTO
        forbidNonWhitelisted: true, // throw error if whitelist is true and a non-whitelisted field is present
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // reference consumer
    consumer
      .apply(
        cookieSession({
          keys: ['cookie-session-key'],
        }),
      )
      // NOTE: global middleware, moved from main.ts
      .forRoutes('*');
  }
}
