import sinon from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import proxyquire from 'proxyquire';
import express, { Express } from 'express';

describe('[ROUTE] AUTH /api/users', () => {
  describe('POST /api/users/register', () => {
    let app: Express;
    let jwtSign: sinon.SinonStub;
    let bcryptHash: sinon.SinonStub;
    let findOneStub: sinon.SinonStub;
    let createStub: sinon.SinonStub;

    beforeEach(() => {
      jwtSign = sinon.stub();
      bcryptHash = sinon.stub();
      findOneStub = sinon.stub();
      createStub = sinon.stub();

      const routerStub = proxyquire('../routes/auth', {
        'jsonwebtoken': {
          sign: jwtSign,
          '@noCallThru': true,
        },
        'bcrypt': {
          hash: bcryptHash,
          '@noCallThru': true,
        },
        '../models/User': {
          findOne: findOneStub,
          create: createStub,
        },
        '@noCallThru': true,
      });

      app = express();
      app.use(express.json());
      app.use('/api/users/register', routerStub);
    });

    after(() => {
      sinon.restore();
    })

    it('should return 400 and validation errors if invalid input is provided', async () => {
      const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'invalid-email', password: '123' });

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.have.lengthOf(2);
    });

    it('should return 400 if user with email or nickname already exists', async () => {
      findOneStub.resolves(true);

      const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'test@example.com', password: '12345', nickname: 'testUser' });

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({ error: 'Email or nickname already used.' });
    });

    it('should create a new user if valid input is provided', async () => {
      findOneStub.resolves(false);
      bcryptHash.resolves('hashed-password');
      createStub.resolves({
        id: 123,
        email: 'test@example.com',
        nickname: 'testUser',
      });
      jwtSign.returns('valid-token');

      const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'test@example.com', password: '12345', nickname: 'testUser' });

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({ token: 'valid-token' });
    });
  });

})
