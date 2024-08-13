import nock from 'nock'

import { asyncHelper } from './helpers'
import { restoreEnv } from './mocha.setup'

// eslint-disable-next-line mocha/no-top-level-hooks, mocha/no-hooks-for-single-case
after(async () => {
  // wait for any async call to end (typically pubsub) to catch any issue
  await asyncHelper.wait(1000)
  // restore mocked env variables
  restoreEnv()
  // restore http connections (just in case)
  nock.enableNetConnect()
})
