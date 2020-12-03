'use strict'
process.env.NODE_ENV = 'development'
const webpack = require('webpack')
const config = require('../config')
const { merge } = require('webpack-merge')
const path = require('path')
const utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const portfinder = require('portfinder')
const glob = require('glob')
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// build
const configEntry = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const activityFolder = process.env.npm_config_page || 'all';
    let entryFiles
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
    Object.keys(entryFiles).forEach(index => {
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
                favicon: path.resolve(__dirname, '../favicon.ico')
            })
        );
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}

const {entry, htmlWebpackPlugins} = configEntry();

const devWebpackConfig = merge(baseWebpackConfig, {
    entry,
    module: {
        rules: [
            {
                test: /\.less|\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {importLoaders: 1}
                    },
                    'postcss-loader',
                    'less-loader'
                ]
            }
        ]
    },
    devtool: config.dev.devtool,
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: config.dev.assetsPublicPath
    },
    devServer: {
        clientLogLevel: 'warning',
        hot: true,
        contentBase: path.join(__dirname, '../src'),
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open:false,
        overlay: config.dev.errorOverlay
            ? {warnings: false, errors: true}
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll
        },
        historyApiFallback:{
            rewrites:[
               {from:/./,to:'/src/404.html'}
            ]
        },
        disableHostCheck: true,
        watchContentBase: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        ...htmlWebpackPlugins,
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        })
    ]
})
module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }))
            resolve(devWebpackConfig)
        }
    })
})
