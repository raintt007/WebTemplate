import Watcher from './watcher'
export default class Compiler {
    constructor(vm) {
        this.vm = vm;
        this.el = vm.el;
        this.compiler(this.el);
    }
    compiler(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (node.nodeType === 1) {
                // 元素节点
                this.compilerELement(node);
            } else if (node.nodeType === 3) {
                // 文本节点
                this.compilerText(node);
            }
            // 遍历子节点
            if (node.childNodes.length) {
                this.compiler(node);
            }
        })
    }
    compilerELement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name;
            if (attrName.startWith('v-')) {
                attrName = attrName.substr(2);
                const key = attr.value;
                if (attrName === 'model') {
                    // 处理model指令
                }
                this.update(node, key, attrName);
            }
        })
    }
    compilerText(node) {
        const reg = /^\{\{.+?\}\}$/; // 匹配{{...}}
        let value = node.textContent;
        if (reg.test(value)) {
            const key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key]);
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue;
            })
        }
    }

}