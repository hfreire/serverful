# A kickass :muscle: web server :scream_cat: with all the bells :bell: and whistles :sparkles:

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/hfreire/serverful.svg?branch=master)](https://travis-ci.org/hfreire/serverful)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/serverful/badge.svg?branch=master)](https://coveralls.io/github/hfreire/serverful?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/hfreire/serverful.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/github/release/hfreire/serverful.svg)](https://github.com/hfreire/serverful/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/serverful.svg)](https://www.npmjs.com/package/serverful)
[![Downloads](https://img.shields.io/npm/dt/serverful.svg)](https://www.npmjs.com/package/serverful) 

Uses [hapi](https://github.com/hapijs/hapijs) with most important plugins and dynamically detects your routes

### Features
* Supports [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises :white_check_mark:

### How to install
```
node install serverful
```

### How to use

#### Use it in your app
```javascript
// Instantiate and start the server
const Serverful = require('serverful')

const server = new Serverful()
server.start()
```
