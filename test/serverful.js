/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
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

  beforeAll(() => {
    fs = td.object([ 'readdirSync', 'lstatSync' ])

    Hapi = td.object([])
    Hapi.server = td.constructor([ 'auth', 'events', 'start', 'stop', 'register' ])

    Hapi.server.prototype.auth.scheme = td.function()
    Hapi.server.prototype.auth.strategy = td.function()
    Hapi.server.prototype.auth.default = td.function()
    Hapi.server.prototype.app = td.object([])
    Hapi.server.prototype.events = td.object([ 'on' ])

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

      td.replace('@hapi/hapi', Hapi)

      td.replace('@hapi/boom', Boom)

      td.replace('@hapi/inert', Inert)

      td.replace('@hapi/vision', Vision)

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
      td.verify(Hapi.server.prototype.events.on('start'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server stop event', () => {
      td.verify(Hapi.server.prototype.events.on('stop'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server route event', () => {
      td.verify(Hapi.server.prototype.events.on('route'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server response event', () => {
      td.verify(Hapi.server.prototype.events.on('response'), { times: 1, ignoreExtraArgs: true })
    })

    it.skip('should register route to ping', () => {
      td.verify(Hapi.server.prototype.register(pingRouteConfig), { times: 1 })
    })

    it.skip('should register route to healthcheck', () => {
      td.verify(Hapi.server.prototype.register(healthcheckRouteConfig), { times: 1 })
    })

    it('should add server health check', () => {
      td.verify(Health.addCheck(), { ignoreExtraArgs: true, times: 1 })
    })
  })

  describe('when starting a server', () => {
    beforeEach(() => {
      td.when(Hapi.server.prototype.start()).thenCallback()
      td.replace('@hapi/hapi', Hapi)

      td.replace('@hapi/boom', Boom)

      td.replace('@hapi/inert', Inert)

      td.replace('@hapi/vision', Vision)

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
          td.verify(Hapi.server.prototype.start(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when starting a server that is already running', () => {
    beforeEach(() => {
      td.when(Hapi.server.prototype.start()).thenCallback()
      td.replace('@hapi/hapi', Hapi)

      td.replace('@hapi/boom', Boom)

      td.replace('@hapi/inert', Inert)

      td.replace('@hapi/vision', Vision)

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
          td.verify(Hapi.server.prototype.start(), { times: 0 })
        })
    })
  })

  describe('when starting a server and hapi fails to start', () => {
    const error = new Error('my-error-message')

    beforeEach(() => {
      td.when(Hapi.server.prototype.start()).thenCallback(error)
      td.replace('@hapi/hapi', Hapi)

      td.replace('@hapi/boom', Boom)

      td.replace('@hapi/inert', Inert)

      td.replace('@hapi/vision', Vision)

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
      td.when(Hapi.server.prototype.start()).thenCallback()
      td.when(Hapi.server.prototype.stop()).thenCallback()
      td.replace('@hapi/hapi', Hapi)

      td.replace('@hapi/boom', Boom)

      td.replace('@hapi/inert', Inert)

      td.replace('@hapi/vision', Vision)

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
          td.verify(Hapi.server.prototype.stop(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when stopping a non-running server', () => {
    beforeEach(() => {
      td.replace('@hapi/hapi', Hapi)

      td.replace('@hapi/boom', Boom)

      td.replace('@hapi/inert', Inert)

      td.replace('@hapi/vision', Vision)

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
      td.when(Hapi.server.prototype.start()).thenCallback()
      td.when(Hapi.server.prototype.stop()).thenCallback(error)
      td.replace('@hapi/hapi', Hapi)

      td.replace('@hapi/boom', Boom)

      td.replace('@hapi/inert', Inert)

      td.replace('@hapi/vision', Vision)

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
