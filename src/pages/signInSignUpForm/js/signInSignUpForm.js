/**
 * @since 2020/12/03 19:10:29
 */

const signInBtn = document.querySelector('.sign-in-btn');
const signUpBtn = document.querySelector('.sign-up-btn');
const container = document.querySelector('.signInSignUpForm-wrapper');
signUpBtn.addEventListener('click', () =>{
    container.classList.add('sign-up-mode')
})
signInBtn.addEventListener('click', () =>{
    container.classList.remove('sign-up-mode')
})