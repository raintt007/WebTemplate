//Watcher:负责创建data中的key 和更新函数的映射
class Watcher {
    constructor(vm, key, cb) {
      this.$vm = vm;
      this.$key = key;
      this.$cb = cb;
      //关键：
      //1.把当前的watcher实例附加到Dep的静态属性上(这里的Dep.target相当于一个临时变量)
      //2.然后访问下属性触发执行get方法添加到dep里面
      Dep.target = this;
      this.$vm[this.$key]; //触发依赖收集
      Dep.target = null; //置空
    }
    update() {
     this.$cb && this.$cb.call(this.$vm, this.$vm[this.$key]);
    }
  }