# A kickass :muscle: web server :scream_cat: with all the bells :bell: and whistles :sparkles:

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/hfreire/serverful.svg?branch=master)](https://travis-ci.org/hfreire/serverful)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/serverful/badge.svg?branch=master)](https://coveralls.io/github/hfreire/serverful?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/hfreire/serverful.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/github/release/hfreire/serverful.svg)](https://github.com/hfreire/serverful/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/serverful.svg)](https://www.npmjs.com/package/serverful)
[![Downloads](https://img.shields.io/npm/dt/serverful.svg)](https://www.npmjs.com/package/serverful) 

Uses [hapi](https://github.com/hapijs/hapijs) loaded with most important plugins ([Boom](https://github.com/hapijs/boom), [Vision](https://github.com/hapijs/vision), [Inert](https://github.com/hapijs/inert), et al.) and dynamically configures your routes

### Features
* Out-of-the-box `/ping` and a `/healthcheck` (using [health-checkup](https://github.com/hfreire/health-checkup)) endpoints :white_check_mark:
* [Swagger](http://swagger.io) API `/docs` :white_check_mark: 
* Response pagination using [hapi-pagination](https://github.com/fknop/hapi-pagination) :white_check_mark:
* Logs HTTP requests and server errors using [modern-logger](https://github.com/hfreire/modern-logger) :white_check_mark:
* Supports [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises :white_check_mark:

### How to install
```
npm install serverful
```

### How to use

#### Use it in your app
Load module and start a server
```javascript
const Serverful = require('serverful')

const server = new Serverful()
server.start()
```

#### Available environment variables
Variable | Description | Required | Default value
:---:|:---:|:---:|:---:
NAME | The name of the app | false | `undefined`
VERSION | The version of the app | false | `undefined`
PORT | The port to be used by the HTTP server | false | `3000`
API_KEYS | The secret keys that should be used when securing endpoints | false | `undefined`
SO_TIMEOUT | TCP socket connection timeout | false | `120000`
LOG_LEVEL | The log level verbosity | false | `info`
ENVIRONMENT | The environment the app is running on | false | `undefined`
ROLLBAR_API_KEY | The server API key used to talk with Rollbar | false | `undefined`


### Used by
* [get-me-a-date](https://github.com/hfreire/get-me-a-date) - :heart_eyes: Help me get a :cupid: date tonight :first_quarter_moon_with_face:
* [watch-rtp-play](https://github.com/hfreire/watch-rtp-play) - :tv: Watch and :radio: listen 🇵🇹 RTP Play without a :computer: browser
* [browser-as-a-service](https://github.com/hfreire/browser-as-a-service) - A web browser :earth_americas: hosted as a service, to render your JavaScript web pages as HTML
