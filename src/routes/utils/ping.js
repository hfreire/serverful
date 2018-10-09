/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const PING_PATH = process.env.PING_PATH || '/ping'

const Route = require('../route')

const Joi = require('joi')

class Ping extends Route {
  constructor () {
    super('GET', PING_PATH, 'Ping', 'Returns a pong for every ping')
  }

  handler (request, h) {
    return { answer: 'pong' }
  }

  tags () {
    return [ 'api', 'utils' ]
  }

  auth () {
    return false
  }

  plugins () {
    return {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Service is alive',
            schema: Joi.object({
              answer: 'pong'
            }).label('Reply')
          }
        }
      }
    }
  }
}

module.exports = new Ping()
