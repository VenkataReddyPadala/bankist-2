'use strict';

///////////////////////////////////////
// Modal window

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();

  //  message.parentElement.removeChild(message);  old style of writing before remove() introduced
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  // It will give the height of the section1 from top of the page depending on viewport

  // console.log(window.pageXOffset,window.pageYOffset); // to get the scroll position
  // console.log(document.documentElement.clientHeight,document.documentElement.clientWidth); // to get the viewport height and width
  // console.log(s1coords);

  // window.scrollTo(
  //   {
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top+window.pageYOffset, // coordinates of element from viewport + scroll position from top of website
  //     behavior: 'smooth'

  //   });

  section1.scrollIntoView({ behavior: 'smooth' }); //New way to scroll
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(el ()=> {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// By doing this we are adding event listener to each link if there are more links then it is not effective

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // below condition is not to do anything when clicked in between the links ( in gaps)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabs section

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return; // closest will give null if we click in between the gaps so we are handling it.

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // console.log(clicked.dataset)
  clicked.classList.add('operations__tab--active');
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector('.operations__content--' + `${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// navigation fading effect

// this also works fine
// const nav = document.querySelector('.nav__links');
// const navele = document.querySelectorAll('.nav__link');
// nav.addEventListener('mouseover',(e)=>{
// if(e.target.classList.contains('nav__link')){
//   navele.forEach(ele => ele.style.opacity = '0.5')
//   e.target.style.opacity = '1'
// }

// })

// nav.addEventListener('mouseout',(e)=>{
//   navele.forEach(ele => ele.style.opacity = '1')
// })

///////////////////////////////////////
// navigation fade animation
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
    // this equals to the argument passesed
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
//or we can do nav.addEventListener('mouseover', (e)=> handleHover(e,0.5)); and replace his with the parameter name
//if there are more arguments then pass it as array

nav.addEventListener('mouseout', handleHover.bind(1));

// sticky nav using intersection observer
const navHeight = nav.getBoundingClientRect().height;// to get height of a container based on viewport

const stickyNav = entries => {
  const [entry] = entries; // nothing but const [x,y] = [1,2]  x=1, y=2
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // because we observe whole viewport
  threshold: 0, //because we want to observe when the header is completely scrolled we have one threshold means we will be having only one entry
  rootMargin: `-${navHeight}px`, // to get nav before the header gets to 0 and appear at the height of nav from the end of header
  // only px is allowed here not rem and %
});
headerObserver.observe(header);

// Reveal Section

const allSections = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
  // to not observe when the animation is done once
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // 15% of section is in viewport then it do the job
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // console.log(entry.target);
  // replace low quality img with high quality image
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img');

  // dont remove immediately because if the network is slow the high resolution imgs takes time to load but we are removing
  // blur immediatly before img loaded so we see blured img first and then we see the high resolution img

  // so to show high resolution img only when img is fully loaded use this instead

  entry.target.addEventListener('load', () => {
    // when img is fully loaded
    entry.target.classList.remove('lazy-img'); // remove blur
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // it will start load imgs before 200px then users dont know we are lazy loading
});

imgTargets.forEach(img => imgObserver.observe(img));

// slider

const slider = () => {
  let curSlide = 0;

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const maxSlides = slides.length;

  const goToSlide = curSlide => {
    slides.forEach((slide, ind) => {
      slide.style.transform = `translateX(${100 * (ind - curSlide)}%)`;
      // if slide 1 is active then values are   -100% 0% 100% 200%
    });
  };

  const nextSlide = () => {
    if (curSlide === maxSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = () => {
    if (curSlide === 0) {
      curSlide = maxSlides - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // createing dots in slider

  const dotContainer = document.querySelector('.dots');

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = slide => {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;   or use destructuring

      const { slide } = e.target.dataset;
      activateDot(slide);
      goToSlide(slide);
    }
  });

  const init = () => {
    goToSlide(0); // when page loads call the first slide
    createDots(); // it should happen before activeDot
    activateDot(0); // for first slide when page loaded
  };
  init();
};

slider();


// popup saying changes you made are not saved

// window.addEventListener('beforeunload',(e)=> {
//   e.preventDefault();
//   console.log(e)
//   e.returnValue = '';
// })