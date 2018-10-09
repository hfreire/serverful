/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const HEALTHCHECK_PATH = process.env.HEALTHCHECK_PATH || '/healthcheck'

const Route = require('../route')

const _ = require('lodash')

const Health = require('health-checkup')

class Healthcheck extends Route {
  constructor () {
    super('GET', HEALTHCHECK_PATH, 'Health check', 'Returns a list of health checks')
  }

  async handler (request, h) {
    const status = await Health.checkup()

    if (_.find(status, (check) => !check.is_healthy)) {
      h.response(status).code(503)

      return
    }

    return status
  }

  tags () {
    return [ 'api', 'utils' ]
  }

  auth () {
    return false
  }
}

module.exports = new Healthcheck()
