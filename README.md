# A kickass :muscle: web server :scream_cat: with all the bells :bell: and whistles :sparkles:

[![Build Status](https://travis-ci.org/hfreire/serverful.svg?branch=master)](https://travis-ci.org/hfreire/serverful)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/serverful/badge.svg?branch=master)](https://coveralls.io/github/hfreire/serverful?branch=master)
[![](https://img.shields.io/github/release/hfreire/serverful.svg)](https://github.com/hfreire/serverful/releases)
[![Version](https://img.shields.io/npm/v/serverful.svg)](https://www.npmjs.com/package/serverful)
[![Downloads](https://img.shields.io/npm/dt/serverful.svg)](https://www.npmjs.com/package/serverful) 

> Uses [hapi](https://github.com/hapijs/hapijs) loaded with most important plugins ([Boom](https://github.com/hapijs/boom), [Vision](https://github.com/hapijs/vision), [Inert](https://github.com/hapijs/inert), et al.) and dynamically configures your routes

### Features
* Out-of-the-box `/ping` and a `/healthcheck` (using [health-checkup](https://github.com/hfreire/health-checkup)) endpoints :white_check_mark:
* [Swagger](http://swagger.io) API `/docs` :white_check_mark: 
* Response pagination using [hapi-pagination](https://github.com/fknop/hapi-pagination) :white_check_mark:
* Logs HTTP requests and server errors using [modern-logger](https://github.com/hfreire/modern-logger) :white_check_mark:

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
NAME | The name of the app. | false | `undefined`
VERSION | The version of the app. | false | `undefined`
PORT | The port to be used by the HTTP server. | false | `3000`
API_KEYS | The secret keys that should be used when securing endpoints. | false | `undefined`
SO_TIMEOUT | TCP socket connection timeout. | false | `120000`
BASE_PATH | Base path to be prefixed to all available endpoint paths. | false | `/`
PING_PATH | Endpoint path for pinging app. | false | `/ping`
HEALTHCHECK_PATH | Endpoint for checking app health. | false | `/healthcheck`
LOG_LEVEL | The log level verbosity. | false | `info`
ENVIRONMENT | The environment the app is running on. | false | `undefined`
ROLLBAR_API_KEY | The server API key used to talk with Rollbar. | false | `undefined`

### How to contribute
You can contribute either with code (e.g., new features, bug fixes and documentation) or by [donating 5 EUR](https://paypal.me/hfreire/5). You can read the [contributing guidelines](CONTRIBUTING.md) for instructions on how to contribute with code. 

All donation proceedings will go to the [Sverige för UNHCR](https://sverigeforunhcr.se), a swedish partner of the [UNHCR - The UN Refugee Agency](http://www.unhcr.org), a global organisation dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.

### Used by
* [get-me-a-date](https://github.com/hfreire/get-me-a-date) - :heart_eyes: Help me get a :cupid: date tonight :first_quarter_moon_with_face:
* [watch-rtp-play](https://github.com/hfreire/watch-rtp-play) - :tv: Watch and :radio: listen 🇵🇹 RTP Play without a :computer: browser
* [browser-as-a-service](https://github.com/hfreire/browser-as-a-service) - A web browser :earth_americas: hosted as a service, to render your JavaScript web pages as HTML

### License
Read the [license](./LICENSE.md) for permissions and limitations.
