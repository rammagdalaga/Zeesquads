document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  const formContent = bookingForm.querySelector('.form-content'); 
  const closeForm = document.getElementById('closeForm');
  const fadeElements = document.querySelectorAll(".fade-up");
  const sections = document.querySelectorAll(".white-content");

  const modal = document.getElementById("thankYouModal");
  const continueBtn = document.getElementById("continueBtn");

  const consentCheckbox = document.getElementById("consent");
  const submitBtn = document.getElementById("submit");

  function disableBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function enableBodyScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function showForm() {
    bookingForm.classList.add('show');
    bookingForm.scrollTop = 0;
    disableBodyScroll();
  }

  document.querySelectorAll('.show-form-btn').forEach(btn => {
    btn.addEventListener('click', showForm);
  });

  closeForm.addEventListener('click', () => {
    bookingForm.classList.remove('show');
    bookingForm.scrollTop = 0;
    enableBodyScroll();
  });

  bookingForm.addEventListener('click', (event) => {
    if (!formContent.contains(event.target)) {
      bookingForm.classList.remove('show');
      enableBodyScroll();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && bookingForm.classList.contains('show')) {
      bookingForm.classList.remove('show');
      enableBodyScroll();
    }
  });

  // ✅ FIXED: Mobile-responsive observer options
  const isMobile = window.innerWidth <= 650;
  
  const observerOptions = {
    threshold: isMobile ? 0.1 : 0.2, // Lower threshold for mobile
    rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px' // Less margin on mobile
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        entry.target.classList.remove("scroll-up");
        
        // ✅ Force styles on mobile if needed
        if (window.innerWidth <= 650) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      } else {
        const rect = entry.target.getBoundingClientRect();
        const isScrollingUp = rect.top > window.innerHeight;
        
        entry.target.classList.remove("active");
        
        if (isScrollingUp) {
          entry.target.classList.add("scroll-up");
        } else {
          entry.target.classList.remove("scroll-up");
        }
      }
    });
  }, observerOptions);

  // ✅ Observe both white-content sections AND fade-up elements
  sections.forEach((section) => observer.observe(section));
  fadeElements.forEach((element) => observer.observe(element));

  // ✅ Handle window resize to update observer settings
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 650;
    if (newIsMobile !== isMobile) {
      // Re-create observer with new settings if screen size category changed
      location.reload(); // Simple solution, or you can recreate the observer
    }
  });

  // ✅ Alternative: Separate observers if you need different behavior
  // const fadeUpObserver = new IntersectionObserver((entries) => {
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       entry.target.classList.add("active");
  //     } else {
  //       entry.target.classList.remove("active");
  //     }
  //   });
  // }, { threshold: 0.1 }); // Different threshold for fade-up elements

  // fadeElements.forEach((element) => fadeUpObserver.observe(element));

  // ✅ Single form submit handler
  bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    // Show loading state (optional but good UX)
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
    }

    const templateParams = {
      name: document.querySelector('#name').value,
      email: document.querySelector('#email').value,
      phone: document.querySelector('#phone').value,
      city: document.querySelector('#city').value,
      state: document.querySelector('#state').value,
      prefLocation: document.querySelector('input[name="location"]:checked')?.value || "",
      prefSched: document.querySelector('input[name="ideal"]:checked')?.value || "",
      licenseStat: document.querySelector('input[name="license"]:checked')?.value || "",
      availability: document.querySelector('input[name="avail"]:checked')?.value || "",
      consentCheck: document.querySelector('input[name="consent"]:checked')?.value || "",
      submitTime: new Date().toLocaleString()
    };

    // Call backend with better error handling
    fetch("/send-email", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Add CSRF token if you're using one
        // "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.content
      },
      body: JSON.stringify(templateParams)
    })
      .then(response => {
        // Check if response is ok before parsing JSON
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          // Success - show modal and reset form
          bookingForm.classList.remove("show");
          modal.classList.add("show");
          bookingForm.reset();
          console.log("✅ Email sent successfully");
        } else {
          // Backend returned error
          console.error("❌ Backend error:", data.error);
          alert("❌ Failed to send email: " + (data.error || "Unknown error"));
        }
      })
      .catch(err => {
        console.error("❌ Network or parsing error:", err);
        
        // More specific error messages
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          alert("❌ Network error. Please check your connection and try again.");
        } else if (err.message.includes('HTTP error')) {
          alert("❌ Server error. Please try again later.");
        } else {
          alert("❌ Failed to send email. Please try again.");
        }
      })
      .finally(() => {
        // Reset button state regardless of success/failure
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      });
  });

  continueBtn.addEventListener("click", function() {
    modal.classList.remove("show");
  });

  if (consentCheckbox && submitBtn) {
    consentCheckbox.addEventListener("change", function() {
      submitBtn.disabled = !this.checked;
    });
  }
});