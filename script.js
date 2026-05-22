/* ========================================
   Tour Guide Malawi - Main JavaScript
   ======================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Sticky Header on Scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
  });

  // 3. Scroll-Triggered Fade-In Animations
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => observer.observe(el));

  // 4. Testimonial Carousel/Slider
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    const slides = track.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }, 6000);
  }

  // 5. Image Lightbox Gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }

  // 6. Contact Form Validation + Submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      document.querySelectorAll('.error-msg').forEach(msg => msg.textContent = '');

      // Validate Name
      const name = document.getElementById('name');
      if (name.value.trim().length < 2) {
        name.nextElementSibling.textContent = 'Please enter your full name';
        isValid = false;
      }

      // Validate Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.nextElementSibling.textContent = 'Please enter a valid email';
        isValid = false;
      }

      // Validate Message
      const message = document.getElementById('message');
      if (message.value.trim().length < 10) {
        message.nextElementSibling.textContent = 'Message must be at least 10 characters';
        isValid = false;
      }

      if (!isValid) return;

      // If valid, submit via fetch
      const formSuccess = document.getElementById('formSuccess');
      formSuccess.textContent = 'Sending...';

      try {
        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(contactForm))
        });
        
        if (res.ok) {
          formSuccess.textContent = 'Message sent! Check your email for confirmation.';
          contactForm.reset();
        } else {
          formSuccess.textContent = 'Something went wrong. Try again.';
        }
      } catch (err) {
        formSuccess.textContent = 'Network error. Try again.';
      }
    });
  }

  // 7. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('show', window.scrollY > 300);
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 8. Parallax Effect for Hero Section
  const hero = document.getElementById('hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
  }

  // 9. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#0') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});