'use strict'
const path = require('path')
const port = require('../projectConf/port')
const proxyTable = require('../projectConf/proxyTable')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: proxyTable.dev,
    host: '127.0.0.1',
    port: port,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: false,
    showEslintErrorsInOverlay: false,
    devtool: "source-map",
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
