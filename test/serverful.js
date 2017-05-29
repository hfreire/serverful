/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Serverful', () => {
  let subject
  let Serverful
  let http
  let pingRoute
  let healthcheckRoute

  before(() => {
    http = td.object([ 'connection', 'auth', 'on', 'route', 'start', 'stop', 'register' ])
    http.auth.scheme = td.function()
    http.auth.strategy = td.function()
    http.auth.default = td.function()
    http.app = td.object([])

    pingRoute = td.object([ 'toRoute' ])
    healthcheckRoute = td.object([ 'toRoute' ])
  })

  afterEach(() => td.reset())

  describe('when constructing a server', () => {
    const pingRouteConfig = {}
    const healthcheckRouteConfig = {}

    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return http } })

      td.replace('../src/routes/ping', pingRoute)
      td.when(pingRoute.toRoute()).thenReturn(pingRouteConfig)

      td.replace('../src/routes/healthcheck', healthcheckRoute)
      td.when(healthcheckRoute.toRoute()).thenReturn(healthcheckRouteConfig)

      Serverful = require('../src/serverful')
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

    it.skip('should configure route to ping ', () => {
      td.verify(http.route(pingRouteConfig), { times: 1 })
    })

    it.skip('should configure route to healthcheck ', () => {
      td.verify(http.route(healthcheckRouteConfig), { times: 1 })
    })
  })

  describe('when starting server', () => {
    beforeEach(() => {
      td.when(http.start()).thenCallback()

      td.replace('hapi', { 'Server': function () { return http } })

      Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    it('should invoke hapi server start', () => {
      return subject.start()
        .finally(() => {
          td.verify(http.start(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when stopping a running server', () => {
    beforeEach(() => {
      td.when(http.start()).thenCallback()
      td.when(http.stop()).thenCallback()

      td.replace('hapi', { 'Server': function () { return http } })

      Serverful = require('../src/serverful')
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
})
