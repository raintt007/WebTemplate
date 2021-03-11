import { observer } from './observer';

function initState(vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
    Proxy(vm, `_data`, key);
    observer(data);
}

function proxy(object, sourceKey, key) {
    Object.defineProperty(object, sourceKey, {
        get() {
            return object.sourceKey[key];
        },
        set(newVal) {
            object.sourceKey[key] = newVal;
        }
    })
}