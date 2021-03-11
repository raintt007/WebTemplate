import {
    arrayMethods
} from "./array";
class observer {
    constructor(value) {
        Object.defineProperty(value, "__ob__", {
            //  值指代的就是Observer的实例
            value: this,
            //  不可枚举
            enumerable: false,
            writable: true,
            configurable: true,
        });


        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods;
            this.observeArray(value);
        }
        this.walk(value)
    }

    walk(data) {
        Object.keys().forEach(key => {
            let value = data[key];
            defineReactive(data, key, value);
        })
    }

    observeArray(items) {
        for (let i = 0; i < items.length; i++) {
            observe(items[i]);
        }
    }
}

function defineReactive(data, key, value) {
    observer(value);
    Object.defineProperty(data, key, {
        get() {
            return data[key];
        },
        set(newValue) {
            if (newValue === value) return;
            console.log("设置值");
            value = newValue;
        }
    })
}

function observe(value) {
    // 如果传过来的是对象或者数组 进行属性劫持
    if (
        Object.prototype.toString.call(value) === '[object Object]' ||
        Object.prototype.toString.call(value) === '[object Array]'
    ) {
        return new observer(value);
    }
}

export default {
    observe
}
