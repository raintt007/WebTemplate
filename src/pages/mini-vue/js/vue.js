import Observer from './observer';
import Compiler from './compile';

class Vue {
    constructor(options) {
        this.$options = options || {};
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        this.$data = options.data || {};
        this.observerData(this.$data);
        // 监听数据的变化
        new Observer(this.$data);
        // 调用compiler类，解析指令和插值
        new Compiler(this);
    }
    observerData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperties(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newVal) {
                    if (newValue === data[key]) {
                        return;
                    }
                    data[key] = newVal
                }
            })
        })
    }
}

export default Vue;
