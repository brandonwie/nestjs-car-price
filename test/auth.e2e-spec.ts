import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { AuthService } from '@/users/auth.service';
import { User } from '@/users/user.entity';

describe('Authentication System', () => {
  let app: INestApplication;

  const password = 'password';
  let aUser: Partial<User>;

  beforeAll(async () => {
    const hashedPassword = await AuthService.hashPassword(password);
    aUser = {
      id: 1,
      email: 'test01@email.com',
      password: hashedPassword,
    };
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: aUser.email, password: password })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(aUser.email);
      });
  });

  // it('handles a delete user request', () => {
  //   return request(app.getHttpServer())
  //     .delete(`/auth/${id}`)
  //     .expect(200)
  //     .then((res) => {
  //       console.log({ res });
  //       expect(res.body).toEqual(undefined);
  //     });
  // });

  it('signup as a new user then get the currently logged in user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: aUser.email, password: password })
      .expect(201);

    const cookie = res.get('Set-Cookie'); // pulling out the cookie from the response

    const response = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.email).toEqual(aUser.email);
  });
});
