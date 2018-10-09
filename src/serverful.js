/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/* eslint-disable new-cap */

const NAME = process.env.NAME
const VERSION = process.env.VERSION
const PORT = process.env.PORT || 3000
const API_KEYS = process.env.API_KEYS

const _ = require('lodash')

const Logger = require('modern-logger')

const Health = require('health-checkup')

const Hapi = require('hapi')
const Boom = require('boom')

const Route = require('./routes/route')

const Inert = {
  plugin: require('inert')
}
const Vision = {
  plugin: require('vision')
}
const HapiSwagger = {
  plugin: require('hapi-swagger'),
  options: {
    info: { title: NAME, version: VERSION },
    basePath: Route.BASE_PATH,
    jsonPath: `${Route.BASE_PATH === '/' ? '' : Route.BASE_PATH}/swagger.json`,
    swaggerUIPath: `${Route.BASE_PATH === '/' ? '' : Route.BASE_PATH}/swaggerui/`,
    documentationPath: `${Route.BASE_PATH === '/' ? '' : Route.BASE_PATH}/docs`,
    tags: [
      { name: 'ping', description: 'Query service status' },
      { name: 'healthcheck', description: 'Query service health' }
    ],
    schemes: [ 'http', 'https' ]
  }
}
const HapiPagination = {
  plugin: require('hapi-pagination'),
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
const { readdirSync, lstatSync } = require('fs')
const { join, dirname } = require('path')

const apiKeys = _.words(API_KEYS, /[^, ]+/g)

const registerEventListeners = function () {
  this._server.events.on('start', () => Logger.info(`Started :rocket: HTTP server on port ${PORT}`))
  this._server.events.on('stop', () => Logger.info('Stopped HTTP server'))
  this._server.events.on('route', ({ path }) => Logger.debug(`Registered route ${path}`))
  this._server.events.on('response', ({ info, method, url, response, headers, query, route }) => {
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
  this._server.events.on('request', (request, { channel, error }) => {
    if (channel === 'error') {
      Logger.error(error)
    }
  })
}

const registerAuthenticationScheme = function () {
  const apiKeyScheme = () => {
    return {
      authenticate: (request, h) => {
        const { headers, query } = request

        const apiKey = headers[ 'x-api-key' ] || (query && query.key)
        if (!apiKey) {
          throw Boom.unauthorized('Missing API key')
        }

        if (!_.includes(apiKeys, apiKey)) {
          throw Boom.unauthorized('Invalid API key')
        }

        return h.authenticated({ credentials: { apiKey } })
      }
    }
  }

  if (!_.isEmpty(apiKeys)) {
    this._server.auth.scheme('apiKey', apiKeyScheme)
    this._server.auth.strategy('default', 'apiKey')
    this._server.auth.default('default')
  }
}

const registerRoutes = function () {
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

        const route = module.toRoute()

        if (!_.isEmpty(apiKeys) && _.isUndefined(_.get(route, 'options.auth'))) {
          _.set(route, 'options.auth', 'default')
        }

        this._server.route(route)
      } catch (error) {
        Logger.error(error)
      }
    })
  }

  _.forEach(paths, (path) => loadPathRoutes(path))
}

const registerPlugins = function () {
  const plugins = [ Inert, Vision, HapiSwagger, HapiPagination ]

  _.forEach(plugins, async (plugin) => {
    try {
      await this._server.register(plugin)

      const name = _.get(plugin, 'plugin.plugin.name', _.get(plugin, 'plugin.plugin.pkg.name'))
      Logger.debug(`Registered plugin ${name}`)
    } catch (error) {
      Logger.error(error)
    }
  })
}

const defaultOptions = {
  hapi: {
    port: PORT,
    debug: false,
    load: {
      sampleInterval: 60000
    },
    plugins: {
      'hapi-swagger': {}
    }
  }
}

class Serverful {
  constructor (options = {}) {
    this._options = _.defaultsDeep({}, options, defaultOptions)

    this._server = new Hapi.server(_.get(this._options, 'hapi'))

    registerEventListeners.bind(this)()
    registerAuthenticationScheme.bind(this)()
    registerRoutes.bind(this)()

    Health.addCheck('server', async () => {
      if (!this._server.load) {
        throw new Error('Unable to read server load metrics')
      }
    })
  }

  async start () {
    if (_.get(this._server, 'app.started')) {
      return
    }

    await registerPlugins.bind(this)()

    await this._server.start()

    _.set(this._server, 'app.started', true)
  }

  async stop (timeout = 1000) {
    if (!_.get(this._server, 'app.started')) {
      return
    }

    await this._server.stop({ timeout })

    _.set(this._server, 'app.started', false)
  }
}

module.exports = Serverful
