/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*===== REMOVE MENU MOBILE =====*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]')

window.addEventListener('scroll', scrollActive)

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id')
        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(!navLink) return

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            navLink.classList.add('active')
        }else{
            navLink.classList.remove('active')
        }
    })
}

/*===== CHANGE BACKGROUND HEADER =====*/
function scrollHeader(){
    const header = document.getElementById('header')
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader)

/*===== CLOSE MENU ON ESC =====*/
window.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){
        const navMenu = document.getElementById('nav-menu')
        navMenu.classList.remove('show')
    }
})

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

window.appScrollReveal = sr

/*SCROLL HOME*/
sr.reveal('.home__title', {})
sr.reveal('.home__subtitle', {delay: 500})
sr.reveal('.home__actions', {delay: 600})
sr.reveal('.home__editorial', {delay: 650})
sr.reveal('.home__scroll', {delay: 800, origin: 'bottom'})

/*SCROLL ABOUT*/
sr.reveal('.about__subtitle', {delay: 300})
sr.reveal('.about__text', {delay: 400})
sr.reveal('.about__info', {delay: 500})
sr.reveal('.about__social', {delay: 600})

/*SCROLL SKILLS*/
sr.reveal('.section-title', {})
sr.reveal('.skills__group', {interval: 100})
sr.reveal('.skills__img', {delay: 400, origin: 'right'})

/*SCROLL PORTFOLIO*/
sr.reveal('.portfolio__card', {interval: 100})

/*SCROLL CONTACT*/
sr.reveal('.contact__info-item', {interval: 100, origin: 'left'})
sr.reveal('.contact__form', {delay: 400, origin: 'right'})
