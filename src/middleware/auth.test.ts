import { expect } from 'chai'
import sinon, { restore, SinonSpy, SinonStub, stub } from 'sinon'
import { Request, Response, NextFunction } from 'express'
import { describe, it } from 'mocha'
import * as jwt from 'jsonwebtoken'
import { authenticateToken, isAdmin } from './auth'
import { User } from '../models'

describe('[AUTH] Auth middleware tests', () => {
  describe('Test authenticateToken middleware', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    const nextFunction: NextFunction = () => {
    }

    beforeEach(() => {
      mockRequest = {}
      mockResponse = {
        sendStatus: sinon.stub(),
        status: sinon.stub().returnsThis(), // 'this' refers to the mockResponse object
        send: sinon.stub(),
      }
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should call next middleware when token is valid', async () => {
      let jwtVerifyStub: sinon.SinonStub
      const requestStub: Partial<Request> = {
        headers: { authorization: 'Bearer VALID_TOKEN' },
      }
      const responseStub: Partial<Response> = {}
      const nextFunctionStub = sinon.stub().returnsThis()

      jwtVerifyStub = sinon.stub(jwt, 'verify')
      jwtVerifyStub.callsFake((token: string, secretOrPublicKey: jwt.Secret, options: jwt.VerifyOptions | undefined, callback: jwt.VerifyCallback | undefined) => {
        if (callback) {
          callback(null, { username: 'testUser' } as any)
        }
      })

      await authenticateToken(requestStub as Request, responseStub as Response, nextFunctionStub)

      expect(nextFunctionStub.calledOnce).to.equal(true)
    })

    it('should return 401 if authorization header is missing', () => {
      mockRequest.headers = {}

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.sendStatus).to.have.been.calledWith(401)
    })

    it('should send 401 when no token is provided', async () => {
      const requestStub: Partial<Request> = { headers: {} }
      const responseStub: Partial<Response> = {
        sendStatus: sinon.stub(),
      }
      const nextFunctionStub = sinon.stub().returnsThis()

      await authenticateToken(requestStub as Request, responseStub as Response, nextFunctionStub)

      expect(responseStub.sendStatus).to.have.been.calledOnceWith(401)
    })

    it('should return 403 if token is not valid', () => {
      mockRequest.headers = {
        authorization: 'Bearer InvalidToken',
      }
      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction)
      expect(mockResponse.sendStatus).to.have.been.calledWith(403)
    })
  })

  describe('isAdmin function', () => {
    let userFind: SinonStub

    beforeEach(() => {
      userFind = stub(User, 'findByPk')
    })

    afterEach(() => {
      restore()
    })

    it('should call next if user is admin', async () => {
      const req = { user: { id: '123' } } as unknown as Request
      const res = {
        status: () => ({
          json: () => {
          },
        }),
      } as unknown as Response
      const next = stub<[], void>()

      userFind.resolves({ roleId: 1 })

      await isAdmin(req, res, next)
      expect(next.called).to.be.true
    })

    it('should respond with 403 if user is not admin', async () => {
      const req = { user: { id: '123' } } as unknown as Request
      const res = { status: stub().returns({ json: stub() }) } as unknown as Response
      const next = stub<[], void>()

      userFind.resolves({ roleId: 2 })

      await isAdmin(req, res, next)
      expect(((res.status as unknown) as SinonSpy).calledWith(403)).to.be.true
    })

    it('should respond with 403 if user is not found', async () => {
      const req = { user: { id: '123' } } as unknown as Request
      const res = { status: stub().returns({ json: stub() }) } as unknown as Response
      const next = stub<[], void>()

      userFind.resolves(null)

      await isAdmin(req, res, next)
      expect(((res.status as unknown) as SinonSpy).calledWith(403)).to.be.true
    })
  })
})
