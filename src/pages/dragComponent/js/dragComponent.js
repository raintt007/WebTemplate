/**
 * @since 2021/02/26 18:48:06
 */

const box = document.querySelector('.box');
box.addEventListener('dragstart', (e) => {
    console.log(e.dataTransfer)
})