import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
const user = {
  login: 'iufb@gmail.com',
  password: '19931991iu',
};
const comic = {
  imgCover: 'cover',
  title: 'One Piece',
  alternativeTitle: 'Two Piece',
  description: 'bla bla bla',
  type: 'manga',
  genres: ['Adventure'],
  status: 'ongoing',
  translateStatus: 'ongoing',
  author: 'Eiichiro Oda',
  artist: 'Eiichiro Oda',
  publishingCompany: 'Shhh',
};
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let comicId: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user);
    token = body.access_token;
  });
  it('/ (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/comic/create')
      .set('Authorization', `Bearer ` + token)
      .send(comic)
      .expect(201)
      .then(({ body }) => {
        comicId = body._id;
        expect(body).toBeDefined();
        done();
      });
  });
  it('/ (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/comic/delete/' + comicId)
      .set('Authorization', 'Bearer' + token)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
