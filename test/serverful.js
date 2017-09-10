/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Serverful', () => {
  let subject
  let fs
  let http
  let Logger
  let Health
  let pingRoute
  let healthcheckRoute

  before(() => {
    fs = td.object([ 'readdirSync', 'lstatSync' ])

    http = td.object([ 'connection', 'auth', 'on', 'route', 'start', 'stop', 'register' ])
    http.auth.scheme = td.function()
    http.auth.strategy = td.function()
    http.auth.default = td.function()
    http.app = td.object([])

    Logger = td.object([ 'info', 'error' ])

    Health = td.object([ 'addCheck' ])

    pingRoute = td.object([ 'toRoute' ])
    healthcheckRoute = td.object([ 'toRoute' ])
  })

  afterEach(() => td.reset())

  describe.skip('when constructing a server', () => {
    const pingRouteConfig = 'my-ping-route-config'
    const healthcheckRouteConfig = 'my-ping-healthcheck-config'

    beforeEach(() => {
      td.when(fs.readdirSync(), { ignoreExtraArgs: true }).thenReturn([])
      td.replace('fs', fs)

      td.replace('hapi', { 'Server': function () { return http } })

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/routes/utils/ping', pingRoute)
      td.when(pingRoute.toRoute()).thenReturn(pingRouteConfig)

      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)
      td.when(healthcheckRoute.toRoute()).thenReturn(healthcheckRouteConfig)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should listen on hapi server start event', () => {
      td.verify(http.on('start'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server stop event', () => {
      td.verify(http.on('stop'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server response event', () => {
      td.verify(http.on('response'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server request-error', () => {
      td.verify(http.on('request-error'), { times: 1, ignoreExtraArgs: true })
    })

    it.skip('should configure route to ping', () => {
      td.verify(http.route(pingRouteConfig), { times: 1 })
    })

    it.skip('should configure route to healthcheck', () => {
      td.verify(http.route(healthcheckRouteConfig), { times: 1 })
    })

    it('should add server health check', () => {
      td.verify(Health.addCheck(), { ignoreExtraArgs: true, times: 1 })
    })
  })

  describe('when starting server', () => {
    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return http } })
      td.when(http.start()).thenCallback()

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should invoke hapi server start', () => {
      return subject.start()
        .finally(() => {
          td.verify(http.start(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when starting server and hapi fails to start', () => {
    const error = new Error('my-error-message')

    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return http } })
      td.when(http.start()).thenCallback(error)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should reject with error', () => {
      return subject.start()
        .catch((_error) => {
          _error.should.be.equal(error)
        })
    })
  })

  describe('when stopping a running server', () => {
    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return http } })
      td.when(http.start()).thenCallback()
      td.when(http.stop()).thenCallback()

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
      return subject.start()
    })

    it('should invoke hapi server stop', () => {
      return subject.stop()
        .finally(() => {
          td.verify(http.stop(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when stopping a non-running server', () => {
    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return http } })

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should resolve', () => {
      return subject.stop()
    })
  })

  describe('when stopping a running server and hapi fails to stop', () => {
    const error = new Error()

    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return http } })
      td.when(http.start()).thenCallback()
      td.when(http.stop()).thenCallback(error)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
      return subject.start()
    })

    it('should reject with error', () => {
      return subject.stop()
        .catch((_error) => {
          _error.should.be.equal(error)
        })
    })
  })
})
