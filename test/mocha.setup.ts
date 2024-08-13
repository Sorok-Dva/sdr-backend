import chai from 'chai'
const chaiAsPromised = require('chai-as-promised');
import chaiExclude from 'chai-exclude'
import chaiHttp from 'chai-http'
// import chaiMatch from 'chai-match'
import mockedEnv from 'mocked-env'
import nock from 'nock'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import sinonStubPromise from 'sinon-stub-promise'


chai.use(chaiAsPromised)
chai.use(chaiExclude)
chai.use(chaiHttp)
// chai.use(chaiMatch)
chai.use(sinonChai)
chai.should()
sinonStubPromise(sinon)

/* We want to mock ALL external http requests */
nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')

process.on('unhandledRejection', reason => {
  // eslint-disable-next-line no-console
  console.error(reason)
  console.error('!!! UNHANDLED REJECTION !!!')
  throw reason
})

// eslint-disable-next-line import/prefer-default-export
export const restoreEnv = mockedEnv({
  /* eslint-disable @typescript-eslint/naming-convention */
  NOTIFICATIONS_DELAY: '50',
  TRUSTPILOT_EMAIL: 'test-trustpilot@email.com',
  ADDRESS_SERVICE_DISABLE_TIMEOUT: '1',
  PARIONS_WS_URL: 'ws://127.0.0.1:8888',
  /* eslint-enable @typescript-eslint/naming-convention */
})
