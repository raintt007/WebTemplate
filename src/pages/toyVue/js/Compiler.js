class Compiler {
    constructor(el, vm) {
      this.$vm = vm;
      this.el = document.querySelector(el);
      this.compile(this.el);
    }
    compile(node) {
      let nodes = node.childNodes;
      Array.from(nodes).forEach(node => {
        //判断节点类型
        if (this.isElement(node)) {
          //是元素标签
          this.compileElement(node);
        } else if (this.isInter(node)) {
          //是插值文本{{}}
          this.compileText(node);
        }
        this.compile(node);
      });
    }
    isElement(node) {
      return node.nodeType === 1;
    }
    isInter(node) {
      return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
    compileText(node) {
      this.update(node, RegExp.$1, "text");
    }
  
    compileElement(node) {
      //获取属性
      let nodeAttrs = node.attributes;
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        const value = attr.value;
        //指令|事件
        if (this.isDirective(attrName)) {
          //截取指令名字
          const dir = attrName.slice(2);
          //执行相应指令的函数
          this[dir] && this[dir](node, value);
        }
      });
    }
    isDirective(attr) {
      return ~attr.indexOf("a-");
    }
  
    model(node, key) {
      node.value = this.$vm[key];
      node.addEventListener("input", e => {
        this.$vm[key] = e.target.value
      });
    }
  
    //update函数  负责更新dom，同时创建watcher实例在两者之间产生联系
    update(node, key, dir) {
      //初始运行
      const updaterFn = this[dir + "Updater"];
      
      updaterFn && updaterFn(node, this.$vm[key]);
      
      //修改时的更新埋点 订阅触发
      new Watcher(this.$vm, key, function(value) {
        updaterFn && updaterFn(node, value);
      });
    }
  
    textUpdater(node, value) {
      node.textContent = value;
    }
  
  }