'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const port = require('../projectConf/port')
const glob = require('glob')

const env = require('../config/prod.env')

const configEntry = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const activityFolder = process.argv.slice(2)[0] || 'all';
    let entryFiles;
    if (!activityFolder) {
        console.log('未请输入目录名！请重新编译')
        process.exit(0)
    } else if (activityFolder === 'all') {
        entryFiles = glob.sync(path.join(__dirname, '../src/pages/*/index.js'))
        console.log(`开始编译所有目录！`)
    } else {
        if (glob.sync(path.join(__dirname, `../src/pages/${activityFolder}/index.js`)).length) {
            entryFiles = glob.sync(path.join(__dirname, `../src/pages/${activityFolder}/index.js`))
            console.log(`开始编译${activityFolder}目录`)
        } else {
            console.log(`${activityFolder}目录不存在，请重新编译`)
            process.exit(0)
        }
    }
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/pages\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `../src/pages/${pageName}/index.html`),
                filename: `pages/${pageName}/index.html`,
                inject: true,
                chunks: [pageName],
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency'
            })
        );
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}
if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerHost: '0.0.0.0',
        analyzerPort: port + 1
    }))
    console.log('--包分析工具已启用--')
}

module.exports = webpackConfig