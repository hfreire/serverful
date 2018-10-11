/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Route', () => {
  let subject

  afterEach(() => td.reset())

  describe('when handling a request', () => {
    const request = undefined
    let h

    beforeEach(() => {
      h = td.function()

      const Route = require('../../src/routes/route')
      subject = new Route()
    })

    it('should return undefined', () => {
      const result = subject.handler(request, h)

      expect(result).toBeUndefined()
    })
  })

  describe('when returning route', () => {
    beforeEach(() => {
      const Route = require('../../src/routes/route')
      subject = new Route()
    })

    it('should have a method', () => {
      const route = subject.toRoute()

      expect(route).toHaveProperty('method')
    })

    it('should have a path', () => {
      const route = subject.toRoute()

      expect(route).toHaveProperty('path')
    })

    it('should have a options', () => {
      const route = subject.toRoute()

      expect(route).toHaveProperty('options')
    })
  })
})
