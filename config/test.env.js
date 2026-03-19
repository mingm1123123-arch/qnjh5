'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  VUE_APP_URL:'"https://txrxyhapi.ruixinit.top/jeecg-boot"'
  // VUE_APP_URL:'"http://localhost:12083/jeecg-boot/"'
})
