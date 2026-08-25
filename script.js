// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'day' ? 'night' : 'day';
  
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme-preference', newTheme);
});

// Mobile Drawer
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const mobileClose = document.querySelector('.mobile-drawer-close');
const mobileDrawer = document.querySelector('.mobile-drawer');
const mobileLinks = document.querySelectorAll('.mobile-links a');

mobileToggle.addEventListener('click', () => {
  mobileDrawer.classList.add('open');
});

mobileClose.addEventListener('click', () => {
  mobileDrawer.classList.remove('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileDrawer.classList.remove('open');
  });
});

// Lightbox
const galleryCards = document.querySelectorAll('.gallery-card');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <div class="lightbox-content">
    <button class="lightbox-close"><i class="ph ph-x"></i></button>
    <img src="" alt="">
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const lightboxCloseBtn = lightbox.querySelector('.lightbox-close');

galleryCards.forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-src');
    if (src) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
    }
  });
});

lightboxCloseBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});

// Intersection Observer for Reveals
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// Smooth Scroll for Anchor Links (Vanilla JS)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust for navbar height
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
    });
});
