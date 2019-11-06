/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Healthcheck', () => {
  let subject
  let serverful
  let Joi
  let Health

  beforeAll(() => {
    serverful = td.object([])
    serverful.Route = td.constructor([])

    Joi = td.object([ 'object', 'label' ])

    Health = td.object([ 'checkup' ])
  })

  afterEach(() => td.reset())

  describe('when handling a request to check a healthy server', () => {
    const status = [ { is_healthy: true } ]
    const request = undefined

    beforeEach(() => {
      td.replace('serverful', serverful)

      td.replace('@hapi/joi', Joi)

      td.replace('health-checkup', Health)
      td.when(Health.checkup()).thenResolve(status)

      subject = require('../../../src/routes/utils/healthcheck')
    })

    it('should return server status', async () => {
      const result = await subject.handler(request)

      expect(result).toEqual(status)
    })
  })

  describe('when handling a request to check a unhealthy server', () => {
    const status = [ { is_healthy: false } ]
    const request = undefined
    let h

    beforeAll(() => {
      h = td.object([ 'response', 'code' ])
    })

    beforeEach(() => {
      td.when(h.response(td.matchers.anything()), { ignoreExtraArgs: true }).thenReturn(h)

      td.replace('serverful', serverful)

      td.replace('@hapi/joi', Joi)

      td.replace('health-checkup', Health)
      td.when(Health.checkup()).thenResolve(status)

      subject = require('../../../src/routes/utils/healthcheck')
    })

    it('should return server status', async () => {
      await subject.handler(request, h)

      td.verify(h.response(status), { times: 1 })
    })

    it('should reply with a 503 status code', async () => {
      await subject.handler(request, h)

      td.verify(h.code(503), { times: 1 })
    })
  })

  describe('when configuring authentication', () => {
    beforeEach(() => {
      td.replace('serverful', serverful)

      td.replace('@hapi/joi', Joi)

      td.replace('health-checkup', Health)

      subject = require('../../../src/routes/utils/healthcheck')
    })

    it('should not require authenticate', () => {
      const auth = subject.auth()

      expect(auth).toBeFalsy()
    })
  })
})
