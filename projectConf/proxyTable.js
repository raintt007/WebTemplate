'use strict'
const test = 'http://www.baidu.com'

module.exports = {
    dev: {
        '/service/': {
            target: test,
            changeOrigin: true,
        },
    }
}