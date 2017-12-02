/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const NAME = process.env.NAME
const VERSION = process.env.VERSION
const PORT = process.env.PORT || 3000
const API_KEYS = process.env.API_KEYS
const SO_TIMEOUT = process.env.SO_TIMEOUT

const _ = require('lodash')
const Promise = require('bluebird')

const Logger = require('modern-logger')

const Health = require('health-checkup')

const { Server } = require('hapi')
const Boom = require('boom')

const Inert = require('inert')
const Vision = require('vision')
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
const HapiPagination = {
  register: require('hapi-pagination'),
  options: {
    query: {
      page: {
        default: 0
      }
    },
    routes: {
      include: [] // Emptying include list will disable pagination
    }
  }
}
const plugins = [ Inert, Vision, HapiSwagger, HapiPagination ]

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

const Route = require('./routes/route')

const { readdirSync, lstatSync } = require('fs')
const { join, dirname } = require('path')

const configureRoutes = function () {
  const paths = [ join(__dirname, '/routes'), join(dirname(require.main.filename), '/routes') ]

  const loadPathRoutes = (path) => {
    let entries
    try {
      entries = readdirSync(path)
    } catch (error) {
      return
    }

    _.forEach(entries, (entry) => {
      if (entry === 'route.js' || _.startsWith(entry, '.')) {
        return
      }

      let stat
      try {
        stat = lstatSync(join(path, `/${entry}`))
      } catch (error) {
        return
      }

      if (stat.isDirectory()) {
        loadPathRoutes(join(path, `/${entry}`))

        return
      }

      const _entry = _.endsWith(entry, '.js') ? entry.substring(0, entry.length - 3) : entry

      try {
        const module = require(join(path, `/${_entry}`))

        if (!(module instanceof Route)) {
          return
        }

        this._http.route(module.toRoute())
      } catch (error) {
        Logger.error(error)
      }
    })
  }

  _.forEach(paths, (path) => loadPathRoutes(path))
}

const defaultOptions = {
  hapi: {
    server: {
      debug: false,
      load: {
        sampleInterval: 60000
      },
      connections: {
        routes: {
          timeout: {
            server: false,
            socket: SO_TIMEOUT
          }
        }
      }
    },
    connection: {
      port: PORT
    }
  }
}

class Serverful {
  constructor (options = {}) {
    this._options = _.defaultsDeep({}, options, defaultOptions)

    this._http = Promise.promisifyAll(new Server(_.get(this._options, 'hapi.server')))

    this._http.connection(_.get(this._options, 'hapi.connection'))

    this._http.on('start', () => Logger.info(`Started :rocket: HTTP server on port ${PORT}`))
    this._http.on('stop', () => Logger.info('Stopped HTTP server'))
    this._http.on('response', ({ info, method, url, response, headers, query, route }) => {
      if (!_.includes(route.settings.tags, 'api')) {
        return
      }

      let level = 'info'

      if (_.includes(route.settings.tags, 'utils')) {
        level = 'debug'
      }

      const remoteAddress = info.remoteAddress
      const path = url.path
      const statusCode = response.statusCode
      const duration = Date.now() - info.received
      const userAgent = headers[ 'user-agent' ] || '-'
      const apiKey = headers[ 'x-api-key' ] || query.key || '-'

      Logger[ level ](`${remoteAddress} - "${method.toUpperCase()} ${path}" ${statusCode} ${duration} "${userAgent}" "${apiKey}"`)
    })
    this._http.on('request-error', (request, error) => Logger.error(error))

    this._http.auth.scheme('apiKey', apiKeyScheme)
    this._http.auth.strategy('default', 'apiKey')
    this._http.auth.default('default')

    this._http.register(plugins)

    configureRoutes.bind(this)()

    Health.addCheck('server', () => Promise.try(() => {
      if (!this._http.load) {
        throw new Error('Unable to read server load metrics')
      }
    }))
  }

  start () {
    return Promise.try(() => {
      if (this._isRunning) {
        return
      }

      return this._http.startAsync()
        .then(() => { this._isRunning = true })
    })
  }

  stop () {
    return Promise.try(() => {
      if (!this._isRunning) {
        return
      }

      return this._http.stopAsync()
        .then(() => { delete this._isRunning })
    })
  }
}

module.exports = Serverful
