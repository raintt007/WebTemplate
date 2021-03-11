import * as _ from './util';
function Element(tagName, props, children) {
    if (!(this instanceof Element)) {

    }
    if (_.isArray(props)) {
        children = props;
        props = {};
    }
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : void 666;

    var count = 0

    _.each(this.children, function (child, i) {
        if (child instanceof Element) {
            count += child.count
        } else {
            children[i] = '' + child
        }
        count++
    })
    // 孩子节点长度
    this.count = count
}

function createElement(tagName, props, children) {
    return new Element(tagName, props, children);
}

Element.prototype.render = function () {
    var el = document.createElement(this.tagName);
    var props = this.props;

    for (var propName in props) {
        var propValue = props[propName]
        _.setAttr(el, propName, propValue)
    }

    _.each(this.children, function (child) {
        var childEl = (child instanceof Element)
            ? child.render()
            : document.createTextNode(child)
        el.appendChild(childEl)
    })
    return el;
}

export default createElement;