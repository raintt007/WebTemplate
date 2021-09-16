// import createElement from './element';
// import diff from './diff';
// import patch from './patch';

// // 1. 构建虚拟DOM
// var tree = createElement('div', {'id': 'container'}, [
//     createElement('h1', {style: 'color: blue'}, ['simple virtal dom']),
//     createElement('p', ['Hello, virtual-dom']),
//     createElement('ul', [createElement('li')])
// ])

// // 2. 通过虚拟DOM构建真正的DOM
// var root = tree.render()
// document.body.appendChild(root)

// // 3. 生成新的虚拟DOM
// var newTree = createElement('div', {'id': 'container'}, [
//     createElement('h1', {style: 'color: red'}, ['simple virtal dom']),
//     createElement('p', ['Hello, virtual-dom']),
//     createElement('ul', [createElement('li', {}, ['item']), createElement('li')])
// ])

// setTimeout(() => {
//     // 4. 比较两棵虚拟DOM树的不同
// var patches = diff(tree, newTree)

// // 5. 在真正的DOM元素上应用变更
// patch(root, patches)
// }, 2000)