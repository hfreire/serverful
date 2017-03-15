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

  before(() => {
    http = td.object([ 'connection', 'auth', 'on', 'route', 'start', 'stop', 'register' ])
    http.auth.scheme = td.function()
    http.auth.strategy = td.function()
    http.auth.default = td.function()
    http.app = td.object([])
  })

  afterEach(() => td.reset())

  describe('when constructing a server', () => {
    let pingRoute
    let healthcheckRoute

    before(() => {
      Serverful = require('../src/serverful')
      subject = new Serverful()
    })

    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return http } })

      pingRoute = td.object([])
      const ping = td.replace('../src/routes/ping', td.object([ 'toRoute' ]))
      td.when(ping.toRoute()).thenReturn(pingRoute)

      healthcheckRoute = td.object([])
      const healthcheck = td.replace('../src/routes/healthcheck', td.object([ 'toRoute' ]))
      td.when(healthcheck.toRoute()).thenReturn(healthcheckRoute)
    })

    afterEach(() => {
      delete require.cache[ require.resolve('../src/serverful') ]
    })

    it('should listen on hapi server start event', () => {
      Serverful = require('../src/serverful')
      subject = new Serverful()

      td.verify(http.on('start'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server stop event', () => {
      Serverful = require('../src/serverful')
      subject = new Serverful()

      td.verify(http.on('stop'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server response event', () => {
      Serverful = require('../src/serverful')
      subject = new Serverful()

      td.verify(http.on('response'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server request-error', () => {
      Serverful = require('../src/serverful')
      subject = new Serverful()

      td.verify(http.on('request-error'), { times: 1, ignoreExtraArgs: true })
    })

    it.skip('should configure route to ping ', () => {
      Serverful = require('../src/serverful')
      subject = new Serverful()

      td.verify(http.route(pingRoute), { times: 1 })
    })

    it.skip('should configure route to healthcheck ', () => {
      Serverful = require('../src/serverful')
      subject = new Serverful()

      td.verify(http.route(healthcheckRoute), { times: 1 })
    })
  })

  describe('when starting server', () => {
    before(() => {
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
    before(() => {
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
