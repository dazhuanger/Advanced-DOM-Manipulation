'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////////////////////////////////

// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////////
// Page navigation
// Smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  // getBoundingClientRect tells the location and size of the reactangle (box)
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // // Only working for mordern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////////////////////////
/* Event delegation, putting Event Listener on the parent element 
and using event.target to find the element that triggers the event */
// 1. Add event listener to the parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy, verifying whether the right element is clicked
  if (e.target.classList.contains('nav__link')) {
    // 2. Determine the element that triggered the event
    const target = document.querySelector(e.target.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////////////////
// Tab components
tabsContainer.addEventListener('click', e => {
  const target = e.target.closest('.operations__tab');
  // Guard clause
  if (!target) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  target.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${target.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
/* The event listener expects the second parameter to be a function, instead of a function call.
Using bind() changes the 'this' keyword and returns a new function to be called with a specific 'this' keyword */
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////////////////////////////
// Sticky navigation: intersection observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
// Specifying the root and threshold
const obsOptions = {
  // root: null means the viewport
  root: null,
  // threshold : 0 means no intersection then trigger the callback
  // if threshold: [0, 0.2], triggers the callback every time the intersection reaches the number
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

/////////////////////////////////////////////////////////////////////////
// Reavling element when scrolling with intersection observer API
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  // stop the observer when all sections are revealed
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

/////////////////////////////////////////////////////////////////////////
// Lazy loading images using intersection observer API
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // replacing the src with data-src
  entry.target.src = entry.target.dataset.src;
  // add load event listener to the image like a async
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.15,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////////////////////////////
// Slider function as a whole
const slider = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  // Getting the dot containers at the bottom of the slide show
  const dotContainer = document.querySelector('.dots');
  // Getting buttons
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  /////// Functions ///////
  // Go to slide function
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  // Next slide
  let currentSlide = 0;
  const maxSlide = slides.length - 1;
  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      return;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const prevSlide = function () {
    if (currentSlide === 0) {
      return;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  // Creating dots based on the number of slides
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        // Adding custom dataset attributes to be used to link with slides
        `<button class='dots__dot' data-slide ="${i}"></button>`
      );
    });
  };
  // Activating dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = '${slide}']`)
      .classList.add('dots__dot--active');
  };
  // Initializing
  const init = function () {
    // Setting the initial position of the slides
    goToSlide(0);
    // Creating dots
    createDots();
    // Initial active dot
    activateDot(0);
  };
  init();

  /////// Event listeners ///////
  // Adding event listeners to the buttons
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Adding event listeners to the left and right arrow keys
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  // Adding event listeners to the dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // linking the dot with the slide using a custome HTML data attribute data-slide
      // destructuring
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
