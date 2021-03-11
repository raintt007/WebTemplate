// /**
//  * @since 2021/03/08 22:07:39
//  */
// import { arrayMethods } from './array'


// // 依赖收集的角色，Watcher
// class Watcher {
//     constructor(vm, expOrFn, cb) {
//         this.vm = vm;
//         // 执行getter可以读取data.a.b.c的内容递归读取对象的值
//         this.getter = parsePath(expOrFn);
//         this.value = this.get();
//         this.cb = cb;
//     }
//     get() {
//         Dep.target = this;
//         // 触发了getter就会触发收集依赖的逻辑
//         let value = this.getter.call(this.vm, this.vm);
//         Dep.target = null;
//         return value;
//     }
//     update() {
//         const oldValue = this.value;
//         this.value = this.get();
//         this.cb.call(this.vm, this.value, oldValue);
//     }
// }


// class Dep {
//     constructor() {
//         this.subs = [];
//     }
//     addSub(sub) {
//         this.subs.push(sub)
//     }
//     notify() {
//         this.subs.forEach((item) => {
//             item.update();
//         })
//     }
// }

// vm = {
//     data: {
//         a: 1
//     }
// }

// defineReactive(vm.data, 'a', vm.data['a']);
// vm.data.a
// vm.data.a = 2;

// class Observer {
//     constructor(value) {
//         this.dep = new Dep();
//         this.value = value;
//         if (Array.isArray(value)) {
//            value.__proto__ = arrayMethods; // 新增，拦截数组方法
//         } else {
//             this.walk(value);
//         }
//     }

//     // walk将每一个属性转换成getter/setter的形式侦测变化，只有在数据类型为Object时调用
//     // delete或者新增一个属性，object将无法监听到
//     walk (obj) {
//         const keys = Object.keys(obj);
//         for (let i = 0; i<keys.length; i++) {
//             defineReactive(obj, keys[i], obj[keys[i]]);
//         }
//     }
// }


// function defineReactive(data, key, value) {
//     let childOb = observe(val)
//     let dep = new Dep()
//     // if (typeof value === 'object') {
//     //     // 递归子属性
//     //     new Observer(value);
//     // }
//     // 依赖收集
//     let dep = new Dep();

//     Object.defineProperty(data, key, {
//         enumerable: true,
//         configurable: true,
//         get: function () {
//             // 读取时触发
//             if (Dep.target) {
//                 dep.addSub(Dep.target);
//             }
//             console.log(`data[${key}]: ${value}`);
//             return value;
//         },
//         set: function (newValue) {
//             // 设置时触发
//             console.log(`data[${key}]: ${newValue}`);
//             if (value === newValue) {
//                 return;
//             }
//             // 更新
//             value = newValue;
//             // 触发通知
//             dep.notify();
//         }
//     })
// }

// function observe(value, asRootData) {
//     if (Object.prototype.toString.call(value) !== '[object Object]') {
//         return
//     }
//     let ob;
//     if (Object.)
// }

// function parsePath(path) {
//     const bailRE = /[^\w.$]/;
//     if (bailRE.test(path)) {
//         return
//     }
//     const segments = path.split('.');
//     return function(obj) {
//         for (let i = 0; i<segments.length; i++) {
//             if (!obj) {
//                 return
//             }
//             obj = obj[segments[i]]
//         }
//         return obj;
//     }
// }

