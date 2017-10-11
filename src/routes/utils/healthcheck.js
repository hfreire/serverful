/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const HEALTHCHECK_PATH = process.env.PING_PATH || '/healthcheck'

const Route = require('../route')

const _ = require('lodash')

const Health = require('health-checkup')

class Healthcheck extends Route {
  constructor () {
    super('GET', HEALTHCHECK_PATH, 'Health check', 'Returns a list of health checks')
  }

  handler (request, reply) {
    return Health.checkup()
      .then((status) => {
        const statusCode = _.find(status, (check) => !check.is_healthy) ? 503 : 200

        return reply(null, { status }).code(statusCode)
      })
  }

  tags () {
    return [ 'api', 'utils' ]
  }

  auth () {
    return false
  }
}

module.exports = new Healthcheck()
