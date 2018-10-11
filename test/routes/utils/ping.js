/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Ping', () => {
  let subject
  let serverful
  let Joi

  beforeAll(() => {
    serverful = td.object([])
    serverful.Route = td.constructor([])

    Joi = td.object([ 'object', 'label' ])
  })

  afterEach(() => td.reset())

  describe('when handling a request to ping', () => {
    const request = undefined
    let reply

    beforeAll(() => {
      reply = td.function()
    })

    beforeEach(() => {
      td.replace('serverful', serverful)

      td.replace('joi', Joi)

      subject = require('../../../src/routes/utils/ping')
    })

    it('should return a pong', () => {
      const result = subject.handler(request, reply)

      expect(result).toEqual({ answer: 'pong' })
    })
  })

  describe('when configuring authentication', () => {
    beforeEach(() => {
      td.replace('serverful', serverful)

      td.replace('joi', Joi)

      subject = require('../../../src/routes/utils/ping')
    })

    it('should not require authenticate', () => {
      const auth = subject.auth()

      expect(auth).toBeFalsy()
    })
  })

  describe('when configuring plugins', () => {
    beforeEach(() => {
      td.replace('serverful', serverful)

      td.when(Joi.object(), { ignoreExtraArgs: true }).thenReturn(Joi)
      td.replace('joi', Joi)

      subject = require('../../../src/routes/utils/ping')
    })

    it('should configure hapi-swagger plugin', () => {
      const plugins = subject.plugins()

      expect(plugins).toHaveProperty('hapi-swagger')
    })
  })
})
