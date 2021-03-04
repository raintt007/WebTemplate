export function type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
}

export function isArray(list) {
    return type(list) === 'Array';
}

export function slice(arrayLike, index) {
    return Array.prototype.slice.call(arrayLike, index);
}

export function truthy(value) {
    return !!value;
}

export function isString(list) {
    return type(list) === 'String';
}

export function each(array, fn) {
    array.forEach((item, i) => {
        fn(item, i)
    })
}

export function toArray(listLike) {
    if (!listLike) {
        return []
    }
    var list = [];
    for (var i = 0, len = listLike.length; i < len; i++) {
        list.push(listLike[i])
    }

    return list
}

export function setAttr(node, key, value) {
    switch (key) {
        case 'style':
            node.style.cssText = value
            break
        case 'value':
            var tagName = node.tagName || ''
            tagName = tagName.toLowerCase()
            if (
                tagName === 'input' || tagName === 'textarea'
            ) {
                node.value = value
            } else {
                // if it is not a input or textarea, use `setAttribute` to set
                node.setAttribute(key, value)
            }
            break
        default:
            node.setAttribute(key, value)
            break
    }
}

