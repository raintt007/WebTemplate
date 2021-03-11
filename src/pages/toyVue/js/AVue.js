class AVue {
    constructor(options) {
      this.$options = options;
      this.$data = options.data;
      //这个是多余的  目的是为了测试一个{{}}对应一个wahter
      this.deps = [];
      this.observe(this.$data);
      new Compiler(options.el, this);
    }
  
    //数据响应
    observe(Value) {
      if (!Value || typeof Value !== "object") {
        return;
      }
      Object.keys(Value).forEach(key => {
        this.defineReactive(Value, key, Value[key]);
        //代理
        this.proxyData(key);
      });
    }
  
    //数据响应  val作为闭包 存取都是用临时变量 防止出现死循环
    defineReactive(obj, key, val) {
      //递归
      this.observe(val);
      //做依赖收集  为什么会写在这里呢？写在这里实例不会多创建，也是对应的一个key对应一个实例
      let dep = new Dep();
      //测试添加
      this.deps.push(dep);
      //get和set是独立的回调函数 val值作为闭包临时变量共享
      Object.defineProperty(obj, key, {
        get() {
          //添加到Dep瞬时调用收集到
          console.log("get" + key);
          if (Dep.target) dep.addWatcher(Dep.target);
          return val;
        },
        set(newVal) {
          console.log("set" + key);
          if (val === newVal) return;
          val = newVal;
          //广播通知更新操作 发布
          dep.notify();
        }
      });
    }
  
    //代理data
    proxyData(key) {
      // 需要给vue实例定义属性
      Object.defineProperty(this, key, {
        get() {
          return this.$data[key];
        },
        set(newVal) {
          this.$data[key] = newVal;
        }
      });
    }
  }