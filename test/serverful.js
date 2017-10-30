/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Serverful', () => {
  let subject
  let fs
  let Hapi
  let Boom
  let Inert
  let Vision
  let HapiSwagger
  let HapiPagination
  let Logger
  let Health
  let Route
  let pingRoute
  let healthcheckRoute

  before(() => {
    fs = td.object([ 'readdirSync', 'lstatSync' ])

    Hapi = td.object([])
    Hapi.Server = td.constructor([ 'connection', 'auth', 'on', 'route', 'start', 'stop', 'register' ])

    Hapi.Server.prototype.auth.scheme = td.function()
    Hapi.Server.prototype.auth.strategy = td.function()
    Hapi.Server.prototype.auth.default = td.function()
    Hapi.Server.prototype.app = td.object([])

    Boom = td.object([])

    Inert = td.object([])

    Vision = td.object([])

    HapiSwagger = td.object([])

    HapiPagination = td.object([])

    Logger = td.object([ 'info', 'error' ])

    Health = td.object([ 'addCheck' ])

    Route = td.constructor([])

    pingRoute = td.object([ 'toRoute' ])
    healthcheckRoute = td.object([ 'toRoute' ])
  })

  afterEach(() => td.reset())

  describe('when constructing a server', () => {
    const pingRouteConfig = 'my-ping-route-config'
    const healthcheckRouteConfig = 'my-ping-healthcheck-config'

    beforeEach(() => {
      td.when(fs.readdirSync(), { ignoreExtraArgs: true }).thenReturn([])
      td.replace('fs', fs)

      td.replace('hapi', Hapi)

      td.replace('boom', Boom)

      td.replace('inert', Inert)

      td.replace('vision', Vision)

      td.replace('hapi-swagger', HapiSwagger)

      td.replace('hapi-pagination', HapiPagination)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/route/route', Route)

      td.when(pingRoute.toRoute()).thenReturn(pingRouteConfig)
      td.replace('../src/routes/utils/ping', pingRoute)

      td.when(healthcheckRoute.toRoute()).thenReturn(healthcheckRouteConfig)
      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should listen on hapi server start event', () => {
      td.verify(Hapi.Server.prototype.on('start'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server stop event', () => {
      td.verify(Hapi.Server.prototype.on('stop'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server response event', () => {
      td.verify(Hapi.Server.prototype.on('response'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server request-error', () => {
      td.verify(Hapi.Server.prototype.on('request-error'), { times: 1, ignoreExtraArgs: true })
    })

    it.skip('should configure route to ping', () => {
      td.verify(Hapi.Server.prototype.route(pingRouteConfig), { times: 1 })
    })

    it.skip('should configure route to healthcheck', () => {
      td.verify(Hapi.Server.prototype.route(healthcheckRouteConfig), { times: 1 })
    })

    it('should add server health check', () => {
      td.verify(Health.addCheck(), { ignoreExtraArgs: true, times: 1 })
    })
  })

  describe('when starting a server', () => {
    beforeEach(() => {
      td.when(Hapi.Server.prototype.start()).thenCallback()
      td.replace('hapi', Hapi)

      td.replace('boom', Boom)

      td.replace('inert', Inert)

      td.replace('vision', Vision)

      td.replace('hapi-swagger', HapiSwagger)

      td.replace('hapi-pagination', HapiPagination)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/route/route', Route)

      td.replace('../src/routes/utils/ping', pingRoute)

      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should invoke hapi server start', () => {
      return subject.start()
        .finally(() => {
          td.verify(Hapi.Server.prototype.start(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when starting a server that is already running', () => {
    beforeEach(() => {
      td.when(Hapi.Server.prototype.start()).thenCallback()
      td.replace('hapi', Hapi)

      td.replace('boom', Boom)

      td.replace('inert', Inert)

      td.replace('vision', Vision)

      td.replace('hapi-swagger', HapiSwagger)

      td.replace('hapi-pagination', HapiPagination)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/route/route', Route)

      td.replace('../src/routes/utils/ping', pingRoute)

      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
      return subject.start()
    })

    it('should not invoke hapi server start', () => {
      return subject.start()
        .finally(() => {
          td.verify(Hapi.Server.prototype.start(), { times: 0 })
        })
    })
  })

  describe('when starting a server and hapi fails to start', () => {
    const error = new Error('my-error-message')

    beforeEach(() => {
      td.when(Hapi.Server.prototype.start()).thenCallback(error)
      td.replace('hapi', Hapi)

      td.replace('boom', Boom)

      td.replace('inert', Inert)

      td.replace('vision', Vision)

      td.replace('hapi-swagger', HapiSwagger)

      td.replace('hapi-pagination', HapiPagination)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/route/route', Route)

      td.replace('../src/routes/utils/ping', pingRoute)

      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should reject with error', () => {
      return subject.start()
        .catch((_error) => {
          _error.should.have.property('message', error.message)
        })
    })
  })

  describe('when stopping a running server', () => {
    beforeEach(() => {
      td.when(Hapi.Server.prototype.start()).thenCallback()
      td.when(Hapi.Server.prototype.stop()).thenCallback()
      td.replace('hapi', Hapi)

      td.replace('boom', Boom)

      td.replace('inert', Inert)

      td.replace('vision', Vision)

      td.replace('hapi-swagger', HapiSwagger)

      td.replace('hapi-pagination', HapiPagination)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/route/route', Route)

      td.replace('../src/routes/utils/ping', pingRoute)

      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
      return subject.start()
    })

    it('should invoke hapi server stop', () => {
      return subject.stop()
        .finally(() => {
          td.verify(Hapi.Server.prototype.stop(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when stopping a non-running server', () => {
    beforeEach(() => {
      td.replace('hapi', Hapi)

      td.replace('boom', Boom)

      td.replace('inert', Inert)

      td.replace('vision', Vision)

      td.replace('hapi-swagger', HapiSwagger)

      td.replace('hapi-pagination', HapiPagination)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/route/route', Route)

      td.replace('../src/routes/utils/ping', pingRoute)

      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)

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
      td.when(Hapi.Server.prototype.start()).thenCallback()
      td.when(Hapi.Server.prototype.stop()).thenCallback(error)
      td.replace('hapi', Hapi)

      td.replace('boom', Boom)

      td.replace('inert', Inert)

      td.replace('vision', Vision)

      td.replace('hapi-swagger', HapiSwagger)

      td.replace('hapi-pagination', HapiPagination)

      td.replace('modern-logger', Logger)

      td.replace('health-checkup', Health)

      td.replace('../src/route/route', Route)

      td.replace('../src/routes/utils/ping', pingRoute)

      td.replace('../src/routes/utils/healthcheck', healthcheckRoute)

      const Serverful = require('../src/serverful')
      subject = new Serverful()
      return subject.start()
    })

    it('should reject with error', () => {
      return subject.stop()
        .catch((_error) => {
          _error.should.have.property('message', error.message)
        })
    })
  })
})
