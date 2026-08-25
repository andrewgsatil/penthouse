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
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-content img');
const lightboxCloseBtn = lightbox.querySelector('.lightbox-close');
const lightboxPrevBtn = document.querySelector('.lightbox-prev');
const lightboxNextBtn = document.querySelector('.lightbox-next');
const lightboxCounter = document.querySelector('.lightbox-counter');
const lightboxThumbnails = document.querySelector('.lightbox-thumbnails');

let currentLightboxIndex = 0;
const galleryData = Array.from(galleryCards).map((card, index) => {
  const src = card.getAttribute('data-src');
  const img = card.querySelector('img');
  const alt = img ? img.getAttribute('alt') : 'Gallery image';
  return { src, alt, index };
});

// Generate thumbnails
galleryData.forEach((data, index) => {
  const thumbBtn = document.createElement('button');
  thumbBtn.className = 'lightbox-thumb';
  thumbBtn.dataset.index = index;
  thumbBtn.setAttribute('aria-label', `View ${data.alt}`);
  thumbBtn.innerHTML = `<img src="${data.src}" alt="${data.alt} thumbnail">`;
  thumbBtn.addEventListener('click', () => updateLightbox(index));
  lightboxThumbnails.appendChild(thumbBtn);
});

const updateLightbox = (index) => {
  const data = galleryData[index];
  currentLightboxIndex = index;
  
  // Crossfade effect
  lightboxImg.style.opacity = 0;
  setTimeout(() => {
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxImg.style.opacity = 1;
  }, 250);

  lightboxCounter.textContent = `${index + 1} / ${galleryData.length}`;

  // Update thumbnails state
  document.querySelectorAll('.lightbox-thumb').forEach(thumb => {
    thumb.classList.toggle('active', parseInt(thumb.dataset.index) === index);
  });
  
  // Scroll active thumbnail into view smoothly
  const activeThumb = lightboxThumbnails.querySelector(`.lightbox-thumb[data-index="${index}"]`);
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
};

const openLightbox = (index) => {
  updateLightbox(index);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
};

const nextLightboxImage = () => {
  let nextIndex = currentLightboxIndex + 1;
  if (nextIndex >= galleryData.length) nextIndex = 0;
  updateLightbox(nextIndex);
};

const prevLightboxImage = () => {
  let prevIndex = currentLightboxIndex - 1;
  if (prevIndex < 0) prevIndex = galleryData.length - 1;
  updateLightbox(prevIndex);
};

// Event Listeners
galleryCards.forEach((card, index) => {
  card.addEventListener('click', () => openLightbox(index));
});

lightboxCloseBtn.addEventListener('click', closeLightbox);
lightboxPrevBtn.addEventListener('click', prevLightboxImage);
lightboxNextBtn.addEventListener('click', nextLightboxImage);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
    closeLightbox();
  }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowRight') nextLightboxImage();
  if (e.key === 'ArrowLeft') prevLightboxImage();
  if (e.key === 'Escape') closeLightbox();
});

// Touch Swipe Navigation
let touchStartX = 0;
let touchEndX = 0;

lightboxImg.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

lightboxImg.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    nextLightboxImage();
  }
  if (touchEndX > touchStartX + swipeThreshold) {
    prevLightboxImage();
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
