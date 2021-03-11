/**
 * @since 2021/03/12 07:12:43
 */

 const PENDING = 'PENDING';
 const RESOLVED = 'RESOLVED';
 const REJECTED = 'REJECTED';
 
 /**
  * 
  * @param {*} promise2 新生成的promise
  * @param {*} x 要处理的目标
  * @param {*} resolve 
  * @param {*} reject 
  */
 
 function resolvePromise(promise2, x, resolve, reject) {
     if ((typeof x === 'object' && x != null) || typeof x === 'function') {
         let then = x.then;
         if (typeof then === 'function') {
             // 如果x是一个promise那么在new的时候executor就立即执行了，就会执行他的resolve，那么数据就会传递到他的then中
             then.call(x, y => {
                 // 当前promise解析出来的结果可能还是一个promise, 直到解析到他是一个普通值
                 resolvePromise(promise2, y, resolve, reject);
             }, r => {
                 reject(r);
             })
         } else {
             resolve(x);
         }
     } else {
         resolve(x);
     }
 }
 
 class MyPromise {
     constructor(executor) {
         this.status = PENDING;
         // resolve
         this.value = undefined;
         // reject
         this.reason = undefined;
 
         this.onResolvedCallbacks = []; // 存放成功回调函数
 
         this.onRejectedCallbacks = []; // 存放成功的回调函数
 
         // 执行executor 传入成功和失败:把内部的resolve和 reject传入executor中用户写的resolve, reject
         try {
             executor(this.resolve, this.reject);
         } catch (e) {
             this.reject(e)
         }
     }
     resolve = (value) => {
         if (this.status === PENDING) {
             this.status = RESOLVED;
             this.value = value;
             console.log(this.onRejectedCallbacks);
 
             this.onResolvedCallbacks.forEach(fn => fn());
         }
     }
     reject = (reason) => {
         if (this.status === PENDING) {
             this.status = REJECTED;
             this.reason = reason;
             this.onRejectedCallbacks.forEach(fn => fn());
         }
     }
     then = (onFulfilled, onRejected) => {
         let promise2 = new MyPromise((resolve, reject) => {
             if (this.status === RESOLVED) {
                 // 执行then中的方法 可能返回的是一个普通值，也可能是一个promise，如果是promise的话，需要让这个promise执行
                 // 使用宏任务把代码放在一下次执行,这样就可以取到promise2,为什么要取到promise2? 这里在之后会介绍到
                 setTimeout(() => {
                     try {
                         let x = onfulfilled(this.value);
                         resolvePromise(promise2, x, resolve, reject);
                     } catch (e) { // 一旦执行then方法报错就走到下一个then的失败方法中
                         console.log(e);
                         reject(e);
                     }
                 }, 0);
 
             }
             if (this.status === REJECTED) {
                 // onRejected(this.reason);
                 setTimeout(() => {
                     try {
                         let x = onRejected(this.reason);
                         resolvePromise(promise2, x, resolve, reject)
                     } catch (e) {
                         reject(e)
                     }
                 })
             }
             // 处理异步的情况
             if (this.status === PENDING) {
                 this.onResolvedCallbacks.push(() => {
                     // TODO ... 自己的逻辑
                     setTimeout(() => {
                         try {
                             let x = onFulfilled(this.value);
                             resolvePromise(promise2, x, resolve, reject);
                         } catch (e) {
                             reject(e)
                         }
                     }, 0)
                    
                 });
                 this.onRejectedCallbacks.push(() => {
                     // TODO ... 自己的逻辑  
                     setTimeout(() => {
                         try {
                             let x = onRejected(this.reason);
                             resolvePromise(promise2, x, resolve, reject);
                         } catch (e) {
                             reject(e)
                         }
                     })
                 });
             }
         })
         return promise2;
     }
 }
 
 
 let promise = new MyPromise((resolve, reject) => {
     setTimeout(() => {
         resolve();
     }, 1000);
 });
 // 发布订阅模式应对异步 支持一个promise可以then多次
 promise.then((res) => {
     console.log('成功的结果1', res);
 }, (error) => {
     console.log(error);
 });
 
 promise.then((res) => {
     console.log('成功的结果2', res);
 }, (error) => {
     console.log(error);
 });
 