const base = {
    log() {},
    logPackage() {},
    getLoadTime() {},
    getTimeoutRes() {},
    bindEvent() {},
    init() {}
}

const pm = (function () {
    // 向前兼容
    if (!window.performance) return base
    const pMonitor = {
        ...base
    }
    let config = {}
    const SEC = 1000
    const TIMEOUT = 10 * SEC
    const setTime = (limit = TIMEOUT) => time => time >= limit
    const getLoadTime = ({
        startTime,
        responseEnd
    }) => responseEnd - startTime
    const getName = ({
        name
    }) => name
    // 生成表单数据
    const convert2FormData = (data = {}) =>
        Object.entries(data).reduce((last, [key, value]) => {
            if (Array.isArray(value)) {
                return value.reduce((lastResult, item) => {
                    lastResult.append(`${key}[]`, item)
                    return lastResult
                }, last)
            }
            last.append(key, value)
            return last
        }, new FormData())
    // 拼接 GET 时的url
    const makeItStr = (data = {}) =>
        Object.entries(data)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')
    pMonitor.getLoadTime = () => {
        console.log(performance.getEntriesByType('navigation'));
        const [{
            domComplete,
            domInteractive,
            domLoading,
            fetchStart,
            redirectEnd,
            redirectStart,
            responseStart,
            navigationStart,
            domainLookupStart,
        }] = performance.getEntriesByType('navigation')
        const blankTime = (domInteractive || domLoading) - fetchStart; // 白屏时间
        const redirectTime = redirectEnd - redirectStart; // 重定向时间
        const ttfbTime = responseStart - navigationStart; // 读取页面第一个字节的时间
        const appcacheTime = domainLookupStart - fetchStart; // DNS缓存时间
        const unloadTime = unloadEventEnd - unloadEven
        console.log(`白屏时间：${blankTime}`)
        return {
            blankTime,
            domComplete,
            redirectTime,
            ttfbTime
        }
    }
    pMonitor.getTimeoutRes = (limit = TIMEOUT) => {
        const isTimeout = setTime(limit)
        const resourceTimes = performance.getEntriesByType('resource')
        return resourceTimes
            .filter(item => isTimeout(getLoadTime(item)))
            .map(getName)
    }
    // 上报数据
    pMonitor.log = (url, data = {}, type = 'POST') => {
        const method = type.toLowerCase()
        const urlToUse = method === 'get' ? `${url}?${makeItStr(data)}` : url
        const body = method === 'get' ? {} : {
            body: convert2FormData(data)
        }
        const init = {
            method,
            ...body
        }
        fetch(urlToUse, init).catch(e => console.log(e))
    }
    // 封装一个上报两项核心数据的方法
    pMonitor.logPackage = () => {
        const {
            url,
            timeoutUrl,
            method
        } = config
        const domComplete = pMonitor.getLoadTime()
        const timeoutRes = pMonitor.getTimeoutRes(config.timeout)
        // 上报页面加载时间
        pMonitor.log(url, {
            domeComplete
        }, method)
        if (timeoutRes.length) {
            pMonitor.log(
                timeoutUrl, {
                    timeoutRes
                },
                method
            )
        }
    }
    // 事件绑定
    pMonitor.bindEvent = () => {
        const oldOnload = window.onload
        window.onload = e => {
            if (oldOnload && typeof oldOnload === 'function') {
                oldOnload(e)
            }
            // 尽量不影响页面主线程
            if (window.requestIdleCallback) {
                window.requestIdleCallback(pMonitor.logPackage)
            } else {
                setTimeout(pMonitor.logPackage)
            }
        }
    }

    /**
     * @param {object} option
     * @param {string} option.url 页面加载数据的上报地址
     * @param {string} option.timeoutUrl 页面资源超时的上报地址
     * @param {string=} [option.method='POST'] 请求方式
     * @param {number=} [option.timeout=10000]
     */
    pMonitor.init = option => {
        const {
            url,
            timeoutUrl,
            method = 'POST',
            timeout = 10000
        } = option
        config = {
            url,
            timeoutUrl,
            method,
            timeout
        }
        // 绑定事件 用于触发上报数据
        pMonitor.bindEvent()
    }

    return pMonitor
})()

export default pm
