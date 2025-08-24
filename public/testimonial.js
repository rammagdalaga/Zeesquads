  let currentIndex = 0;
  const slider = document.getElementById("slider");
  const slides = document.querySelectorAll("#testimonial .container");
  const totalSlides = slides.length;

  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  }