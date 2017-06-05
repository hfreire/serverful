/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Serverful = require('../src/serverful')
const Route = require('../src/routes/route')

describe('Module', () => {
  let subject

  describe('when loading', () => {
    beforeEach(() => {
      subject = require('../src/index')
    })

    it('should export serverful', () => {
      subject.should.have.property('Serverful')
      subject[ 'Serverful' ].should.be.equal(Serverful)
    })

    it('should export route', () => {
      subject.should.have.property('Route')
      subject[ 'Route' ].should.be.equal(Route)
    })
  })
})
