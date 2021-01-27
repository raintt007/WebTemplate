/**
 * @since 2021/01/27 21:57:51
 */

 const btn = document.querySelector('.icon');
 const top = document.querySelector('.top');
 const hongbao = document.querySelector('.hongbao-wrapper');
 btn.addEventListener('click', () => {
    hongbao.style.animation = `roundRule .2s infinite`
    setTimeout(() => {
        hongbao.style.animation = ``;
        top.style.transform = `rotateX(270deg)`;
        top.style.opacity = `0`;
        
    }, 500);
 })

