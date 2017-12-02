/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Route', () => {
  let subject

  afterEach(() => td.reset())

  describe('when handling a request', () => {
    const request = undefined
    let reply

    beforeEach(() => {
      reply = td.function()

      const Route = require('../../src/routes/route')
      subject = new Route()
    })

    it('should return nothing', () => {
      subject.handler(request, reply)

      td.verify(reply(null), { times: 1 })
    })
  })

  describe('when returning route', () => {
    beforeEach(() => {
      const Route = require('../../src/routes/route')
      subject = new Route()
    })

    it('should have a method', () => {
      const route = subject.toRoute()

      route.should.have.property('method')
    })

    it('should have a path', () => {
      const route = subject.toRoute()

      route.should.have.property('path')
    })

    it('should have a config', () => {
      const route = subject.toRoute()

      route.should.have.property('config')
    })
  })
})
