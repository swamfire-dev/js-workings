'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(button => button.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// // _________________ SELECTING ELEMENTS _______________________________
// // console.log(document.documentElement);
// // console.log(document.head);
// // console.log(document.body);

// const header = document.querySelector(".header");
// // console.log(header);
// const allSections = document.querySelectorAll(".section");
// // console.log(allSections);

// const elementById = document.getElementById("section--1");
// // console.log(elementById);

// const allButtons = document.getElementsByTagName("button");
// // console.log(allButtons);

// const classBtn = document.getElementsByClassName("btn");
// // console.log(classBtn);

// // // _______________ Creating and inserting elements ________________________

// // const message = document.createElement("div");
// // message.classList.add("cookie-message");
// // message.textContent = "We use cookies for improved functionality and analytics.";
// // message.innerHTML = "We use cookies for improved functionality and analytics.<button class='btn btn--close-cookie'>Got It!</button>";
// // // header.prepend(message);
// // // header.append(message);
// // // header.append(message.cloneNode(true));
// // header.before(message); // before the header element
// // // header.after(message); // after header element


// // // Delete Element
// // document.querySelector(".btn--close-cookie").addEventListener("click", () => (message.remove()));


// // _______________ STYLES, ATTRIBUTES AND CLASSES ________________________

// const message = document.createElement("div");
// message.classList.add("cookie-message");
// message.textContent = "We use cookies for improved functionality and analytics.";
// message.innerHTML = "We use cookies for improved functionality and analytics.<button class='btn btn--close-cookie'>Got It!</button>";
// header.before(message);
// document.querySelector(".btn--close-cookie").addEventListener("click", () => (message.remove()));
// message.style.backgroundColor = "Green";
// message.style.width = "120%";
// // styles hidden inside the class cant be retrieved directly
// // we can only get inline styles
// // console.log(message.style.height);
// // console.log(message.style.backgroundColor);

// // console.log(getComputedStyle(message).color);
// // console.log("height before:", getComputedStyle(message).height);
// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 40 + "px";
// // console.log("height after:", getComputedStyle(message).height);

// document.documentElement.style.setProperty("--color-primary", "orangered");


// //Atributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo.src);
// console.log(logo.getAttribute("src"));
// console.log("Before change:", logo.alt);
// logo.alt = "Minimalist Bankist Logo";
// console.log("After change:", logo.alt);
// console.log(logo.className);
// // does not works with non-standard attributes
// // for non-standard attributes follow below
// console.log(logo.getAttribute("designer"));

// logo.setAttribute("company", "Bankist");

// // const link = document.querySelector(".twitter-link");
// // console.log(link.href);
// // console.log(link.getAttribute("href"));

// const link = document.querySelector(".nav__link--btn");
// console.log(link.href);
// console.log(link.getAttribute("href"));

// //Data attributes
// // for data attributes, atributes must always start with "data-"
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add("c", "j");
// logo.classList.remove("c", "j");
// // logo.classList.toggle();
// logo.classList.contains("");
// // logo.className = "Swamfire";  // not recommended, it will overwrite everything already available


// ____________________ IMPLEMENTING SMOOTH SCROLLING _________________________
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect(); // gives rectangle co ordinates of the element
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log("current scroll (x/y)", window.pageXOffset, pageYOffset);
  // console.log("height/width viewport", document.documentElement.clientHeight, document.documentElement.clientWidth);

  //scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: "smooth"
  }); // for smooth scrolling
  // section1.scrollIntoView({ behavior: "smooth" }); //supported only in modern browsers
});