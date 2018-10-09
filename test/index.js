/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Module', () => {
  let subject
  let Serverful
  let Route

  beforeAll(() => {
    Serverful = td.constructor()

    Route = td.constructor()
  })

  afterEach(() => td.reset())

  describe('when loading', () => {
    beforeEach(() => {
      td.replace('../src/serverful', Serverful)

      td.replace('../src/routes/route', Route)

      subject = require('../src/index')
    })

    it('should export serverful', () => {
      expect(subject).toHaveProperty('Serverful', Serverful)
    })

    it('should export route', () => {
      expect(subject).toHaveProperty('Route', Route)
    })
  })
})
