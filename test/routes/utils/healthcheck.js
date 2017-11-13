/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Healthcheck', () => {
  let subject
  let serverful
  let Joi
  let Health

  before(() => {
    serverful = td.object([])
    serverful.Route = td.constructor([])

    Joi = td.object([ 'object', 'label' ])

    Health = td.object([ 'checkup' ])
  })

  afterEach(() => td.reset())

  describe('when handling a request to check a healthy server', () => {
    const status = [ { is_healthy: true } ]
    const request = undefined
    let code
    let reply

    before(() => {
      code = td.function()
      reply = td.function()
    })

    beforeEach(() => {
      td.when(reply(td.matchers.anything()), { ignoreExtraArgs: true }).thenReturn({ code })

      td.replace('serverful', serverful)

      td.replace('joi', Joi)

      td.replace('health-checkup', Health)
      td.when(Health.checkup()).thenResolve(status)

      subject = require('../../../src/routes/utils/healthcheck')
    })

    it('should return server status', () => {
      return subject.handler(request, reply)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(reply(td.matchers.anything(), captor.capture()), { times: 1 })

          const response = captor.value
          response.should.have.property('status')
          response.status.should.be.equal(status)
        })
    })

    it('should reply with a 200 status code', () => {
      return subject.handler(request, reply)
        .then(() => {
          td.verify(code(200), { times: 1 })
        })
    })
  })

  describe('when handling a request to check a unhealthy server', () => {
    const status = [ { is_healthy: false } ]
    const request = undefined
    let code
    let reply

    before(() => {
      code = td.function()
      reply = td.function()
    })

    beforeEach(() => {
      td.when(reply(td.matchers.anything()), { ignoreExtraArgs: true }).thenReturn({ code })

      td.replace('serverful', serverful)

      td.replace('joi', Joi)

      td.replace('health-checkup', Health)
      td.when(Health.checkup()).thenResolve(status)

      subject = require('../../../src/routes/utils/healthcheck')
    })

    it('should return server status', () => {
      return subject.handler(request, reply)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(reply(td.matchers.anything(), captor.capture()), { times: 1 })

          const response = captor.value
          response.should.have.property('status')
          response.status.should.be.equal(status)
        })
    })

    it('should reply with a 503 status code', () => {
      return subject.handler(request, reply)
        .then(() => {
          td.verify(code(503), { times: 1 })
        })
    })
  })

  describe('when configuring authentication', () => {
    beforeEach(() => {
      td.replace('serverful', serverful)

      td.replace('joi', Joi)

      td.replace('health-checkup', Health)

      subject = require('../../../src/routes/utils/healthcheck')
    })

    it('should not require authenticate', () => {
      const auth = subject.auth()

      auth.should.be.equal(false)
    })
  })
})
