var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    LOG_DEBUG: true,
    IS_HTTP_PROXY: true,
    HTTP_PROXY_TARGET: 'http://10.34.53.178:8000',
    HTTP_PROXY_CONTEXT: ['/sysmanage', '/throw_strategy', '/console_configuration'],
})
