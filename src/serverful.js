/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NAME = process.env.NAME
const VERSION = process.env.VERSION
const PORT = process.env.PORT || 3000
const API_KEYS = process.env.API_KEYS

const _ = require('lodash')
const Promise = require('bluebird')

const Logger = require('modern-logger')

const Health = require('health-checkup')

const Hapi = require('hapi')
const Boom = require('boom')
const Inert = require('inert')
const Vision = require('vision')

const apiKeys = _.words(API_KEYS, /[^, ]+/g)

const apiKeyScheme = () => {
  return {
    authenticate: function (request, reply) {
      const { headers, query } = request

      const apiKey = headers[ 'x-api-key' ] || (query && query.key)
      if (!apiKey) {
        return reply(Boom.unauthorized('Missing API key'))
      }

      if (!_.includes(apiKeys, apiKey)) {
        return reply(Boom.unauthorized('Invalid API key'))
      }

      return reply.continue({ credentials: { apiKey } })
    }
  }
}

const HapiSwagger = {
  register: require('hapi-swagger'),
  options: {
    info: { title: NAME, version: VERSION },
    documentationPath: '/docs',
    tags: [
      { name: 'ping', description: 'Query service status' },
      { name: 'healthcheck', description: 'Query service health' }
    ]
  }
}

const readdirAsync = Promise.promisify(require('fs').readdir)
const { join, dirname } = require('path')

const configureRoutes = function () {
  return Promise.resolve([ __dirname, dirname(require.main.filename) ])
    .mapSeries((path) => {
      return readdirAsync(join(path, '/routes'))
        .mapSeries((entry) => {
          if (entry.indexOf('route.js') > -1) {
            return
          }

          try {
            const module = require(join(path, `/routes/${entry}`))

            this.http.route(module.toRoute())
          } catch (error) {
            Logger.error(error)
          }
        })
        .catch(() => {})
    })
}

class Serverful {
  constructor (options = { port: PORT }) {
    this.http = new Hapi.Server({ debug: false, load: { sampleInterval: 60000 } })

    this.http.connection(options)

    this.http.on('start', () => Logger.info(`Started :rocket: HTTP server on port ${PORT}`))
    this.http.on('stop', () => Logger.info('Stopped HTTP server'))
    this.http.on('response', ({ info, method, url, response, headers, query }) => {
      const remoteAddress = info.remoteAddress
      const path = url.path
      const statusCode = response.statusCode
      const duration = Date.now() - info.received
      const userAgent = headers[ 'user-agent' ] || '-'
      const apiKey = headers[ 'x-api-key' ] || query.key || '-'

      Logger.info(`${remoteAddress} - "${method.toUpperCase()} ${path}" ${statusCode} ${duration} "${userAgent}" "${apiKey}"`)
    })
    this.http.on('request-error', (request, error) => Logger.error(error))

    this.http.auth.scheme('apiKey', apiKeyScheme)
    this.http.auth.strategy('default', 'apiKey')
    this.http.auth.default('default')

    this.http.register([ Inert, Vision, HapiSwagger ])

    configureRoutes.bind(this)()

    Health.addCheck('server', () => new Promise((resolve, reject) => {
      if (!this.http.load) {
        return reject(new Error('Unable to read server load metrics'))
      }

      resolve()
    }))
  }

  start () {
    return new Promise((resolve, reject) => {
      if (this.http.app.isRunning) {
        return resolve()
      }

      this.http.start((error) => {
        if (error) {
          return reject(error)
        }

        this.http.app.isRunning = true

        resolve()
      })
    })
  }

  stop () {
    return new Promise((resolve, reject) => {
      if (!this.http.app.isRunning) {
        return resolve()
      }

      this.http.stop((error) => {
        delete this.http.app.isRunning

        if (error) {
          return reject(error)
        }

        resolve()
      })
    })
  }
}

module.exports = Serverful
