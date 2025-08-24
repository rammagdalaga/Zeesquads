const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const text3 = document.getElementById('text3');
const section2 = document.getElementById('section2');
const navbar = document.getElementById('navbar');
const whiteContent = section2.querySelector('.white-content');

let normalScroll = false; // flag to allow free scrolling

// First text fades in after load
window.addEventListener('load', () => {
  text1.classList.add('visible');
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // ✅ lock animation mode until reaching white-content
  if (!normalScroll) {
    // text1 control
    if (scrollY > 100) {
      text1.classList.add('hidden');
    } else {
      text1.classList.add('visible');
      text1.classList.remove('hidden');
    }

    // text2 control
    if (scrollY > 200 && scrollY < 600) {
      text2.classList.add('visible');
    } else {
      text2.classList.remove('visible');
      if (scrollY > 200) text2.classList.add('hidden');
      else text2.classList.remove('hidden');
    }

    // White section + navbar control
    if (scrollY > 600) {
      section2.classList.add('visible');
      text3.classList.add('visible');
      navbar.classList.add('visible');
      normalScroll = true; // ✅ switch to free scroll mode
      section2.style.position = "relative"
    }
  } else {
    // ✅ free scroll in white-content
    if (scrollY < 600) {
      normalScroll = false; // lock back to section scroll if going up
      section2.classList.remove('visible');
      text3.classList.remove('visible');
      navbar.classList.remove('visible');
    }
  }
});
