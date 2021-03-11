//创建Dep
//和data中的每一个key对应起来，主要负责管理相关watcher
class Dep {
    constructor() {
      this.watchers = [];
    }
    addWatcher(watcher) {
      this.watchers.push(watcher);
    }
    notify() {
      this.watchers.forEach(watcher => watcher.update());
    }
  }