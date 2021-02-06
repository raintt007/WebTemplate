/**
 * @since 2021/02/06 18:21:08
 */


import "./js/fe-performance.js"
import "./css/fe-performance.less"



const log = async () => {
    const pMonitor = await import("@/util/pMonitor.js")
    console.log(pMonitor.default.getLoadTime())
    console.log(pMonitor.default.getTimeoutRes())
}

const oldOnload = window.onload
window.onload = e => {
  if (oldOnload && typeof oldOnload === 'string') {
    oldOnload(e)
  }
  // 尽量不影响页面主线程
  if (window.requestIdleCallback) {
    window.requestIdleCallback(log)
  } else {
    setTimeout(log)
  }
}