'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
// const PreloadWebpackPlugin = require('preload-webpack-plugin')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const staticUrl = '';
const resolveDir = (dir) => {
    return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
    test: /\.js$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolveDir('src')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

module.exports = {
    resolve: {
        fallback: {
            setImmediate: false,
            dgram: false,
            fs: false,
            net: false,
            tls: false,
            child_process: false
        },
        extensions: ['.js', '.json'],
        alias: {
            '@': resolveDir('src'),
            '~': resolveDir('src/components'),
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.js$/,
                use: 'happypack/loader?id=distsBabel',
                include: [resolveDir('src'), resolveDir('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]'),
                    publicPath: staticUrl
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]'),
                    publicPath: staticUrl
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
                    publicPath: staticUrl
                }
            }
        ]
    },
    plugins: [
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'distsBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'webpack-dists-loader',
                options: {
                    debug: {
                        env: ['development', 'test'],
                        tag: 'debug'
                    },
                    online: {
                        env: ['production'],
                        tag: 'online',
                        specials: {
                            'gear': 'gear',
                            'track': 'track',
                            'tvlog': 'tvlog'
                        }
                    }
                }
            }, {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),
    ],
}