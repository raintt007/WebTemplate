
  function throttle(fun, delay) {
    let last, deferTimer
    return function (args) {
        let that = this
        let _args = arguments
        let now = +new Date()
        if (last && now < last + delay) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(function () {
                last = now
                fun.apply(that, _args)
            }, delay)
        }else {
            last = now
            fun.apply(that,_args)
        }
    }
}

let throttleAjax = throttle(() => {console.log(123)}, 1000)

let inputc = document.querySelector('.throttle')
inputc.addEventListener('keyup', function(e) {
    throttleAjax(e.target.value)
})

