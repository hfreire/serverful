/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Ping', () => {
  let subject

  afterEach(() => td.reset())

  describe('when handling a request to ping', () => {
    const request = undefined
    let reply

    beforeEach(() => {
      reply = td.function()

      subject = require('../../src/routes/ping')
    })

    it('should return a pong', () => {
      subject.handler(request, reply)

      const captor = td.matchers.captor()

      td.verify(reply(td.matchers.anything(), captor.capture()), { times: 1 })

      const response = captor.value
      response.should.have.property('answer')
      response.answer.should.be.equal('pong')
    })
  })

  describe('when authenticating request', () => {
    beforeEach(() => {
      subject = require('../../src/routes/ping')
    })

    it('should allow unauthenticated requests', () => {
      const auth = subject.auth()

      auth.should.be.equal(false)
    })
  })

  describe('when configuring plugins', () => {
    beforeEach(() => {
      subject = require('../../src/routes/ping')
    })

    it('should configure hapi-swagger plugin', () => {
      const plugins = subject.plugins()

      plugins.should.have.property('hapi-swagger')
    })
  })
})
