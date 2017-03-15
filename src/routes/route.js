/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

class Route {
  constructor (method, path, description, notes) {
    this.method = method
    this.path = path
    this.description = description
    this.notes = notes
  }

  payload () {}

  handler (request, reply) {
    return reply(null)
  }

  auth () {}

  plugins () {}

  validate () {}

  cors () {}

  toRoute () {
    return {
      method: this.method,
      path: this.path,
      config: {
        payload: this.payload(),
        handler: this.handler,
        auth: this.auth(),
        plugins: this.plugins(),
        tags: [ 'api' ],
        description: this.description,
        notes: this.notes,
        validate: this.validate(),
        cors: this.cors()
      }
    }
  }
}

module.exports = Route
