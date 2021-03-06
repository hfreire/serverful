/*
 * Copyright (c) 2020, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const SO_TIMEOUT = process.env.SO_TIMEOUT
const BASE_PATH = process.env.BASE_PATH || '/'

class Route {
  constructor (method, path, description, notes) {
    this.method = method
    this.path = path
    this.description = description
    this.notes = notes
  }

  static get BASE_PATH () {
    return BASE_PATH
  }

  payload () {}

  handler (request, h) {
  }

  auth () {}

  plugins () {}

  tags () {
    return [ 'api' ]
  }

  validate () {
    return {}
  }

  cors () {}

  pre () {}

  state () {
    return {
      parse: false
    }
  }

  timeout () {
    return {
      server: false,
      socket: SO_TIMEOUT
    }
  }

  toRoute () {
    return {
      method: this.method,
      path: BASE_PATH === '/' ? this.path : `${BASE_PATH}${this.path}`,
      options: {
        payload: this.payload(),
        handler: this.handler,
        auth: this.auth(),
        plugins: this.plugins(),
        tags: this.tags(),
        description: this.description,
        notes: this.notes,
        validate: this.validate(),
        cors: this.cors(),
        pre: this.pre(),
        state: this.state()
      }
    }
  }
}

module.exports = Route
