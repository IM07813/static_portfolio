// =============================================
// LOADING SCREEN
// =============================================

// Record the moment the script starts executing
const LOADER_MIN_MS = 1800; // ms — minimum display time
const loaderStart = Date.now();
let loaderDismissed = false;

function hideLoader() {
  if (loaderDismissed) return;
  loaderDismissed = true;

  const elapsed = Date.now() - loaderStart;
  const remaining = Math.max(0, LOADER_MIN_MS - elapsed);

  setTimeout(() => {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;

    screen.classList.add('hidden');

    // Remove the element from the DOM cleanly after the CSS fade completes
    screen.addEventListener('transitionend', () => {
      if (screen.parentNode) screen.parentNode.removeChild(screen);
    }, { once: true });

    // Start scroll animations after the loader is gone
    initScrollAnimations();
  }, remaining);
}

// Primary trigger: fires when ALL resources are fully loaded
window.addEventListener('load', hideLoader);

// Hard failsafe: never stuck longer than 5 seconds no matter what
setTimeout(hideLoader, 5000);

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(".fade-in-section");
  animatedElements.forEach((el) => observer.observe(el));
}

// Navigation and scrolling
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  
  if (sections.length === 0 || navItems.length === 0) {
    return;
  }
  
  function setActiveNav() {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop - 150) {
        currentSection = section.getAttribute('id');
      }
    });
    
    if (currentSection) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + currentSection) {
          item.classList.add('active');
        }
      });
      
      mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + currentSection) {
          item.classList.add('active');
        }
      });
    }
  }
  
  // Run on scroll
  window.addEventListener('scroll', setActiveNav);
  
  // Run initially
  setActiveNav();
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Cross-browser compatibility checks
function checkBrowserCompatibility() {
  const features = {
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    requestAnimationFrame: typeof requestAnimationFrame !== 'undefined'
  };

  const unsupportedFeatures = Object.keys(features).filter(key => !features[key]);

  if (unsupportedFeatures.length > 0) {
    console.warn('Some features may not work in this browser:', unsupportedFeatures);
  }

  return features;
}

// Initialization
document.addEventListener("DOMContentLoaded", function () {
  // Check browser compatibility first
  checkBrowserCompatibility();
});


// Video Modal Functionality
const videoUrls = {
  'snapgorithm': 'videos/snapgorithm_new_site_compressed.mp4',
  'crm': 'videos/farm_stack_agentic_CRM.mp4',
  'realestate': 'videos/realestate_pro.mp4',
  'construction': 'videos/contruction_site_portfolio.mp4',
  'rag': 'videos/rag_model_preview_compressed.mp4',
  'linkedin-scraper': 'videos/linkedin_scrapper_preview_compressed.mp4'
};

function openVideoModal(videoSrc) {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalVideo');
  if (!modal || !video) return;

  video.src = videoSrc;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Auto play video
  video.play().catch(e => console.log('Auto-play prevented:', e));
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalVideo');
  if (!modal || !video) return;

  video.pause();
  video.src = '';
  modal.classList.remove('active', 'minimized');
  document.body.style.overflow = '';
}

function minimizeVideo() {
  const modal = document.getElementById('videoModal');
  if (modal) modal.classList.toggle('minimized');
}

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const body = document.body;

  if (!mobileMenuToggle || !mobileNav) return;

  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', function () {
    mobileNav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    body.classList.toggle('menu-open');
  });

  // Close menu when clicking on nav items
  mobileNavItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      
      mobileNav.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      body.classList.remove('menu-open');

      // Update active state for both mobile and desktop nav
      const href = this.getAttribute('href');
      
      document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.getAttribute('href') === href) {
          navItem.classList.add('active');
        }
      });

      // Smooth scroll to section
      const targetSection = document.querySelector(href);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      mobileNav.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });

  // Handle window resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      mobileNav.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });

  // Handle scroll for mobile nav background
  const mobileNavBg = document.querySelector('.mobile-nav-bg');
  if (mobileNavBg) {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        mobileNavBg.classList.add('scrolled');
      } else {
        mobileNavBg.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();
  }
}

// Initialize UI components
document.addEventListener('DOMContentLoaded', function () {
  // Video Modal Listeners
  const closeBtn = document.getElementById('closeBtn');
  const minimizeBtn = document.getElementById('minimizeBtn');
  const modal = document.getElementById('videoModal');

  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  if (minimizeBtn) minimizeBtn.addEventListener('click', minimizeVideo);

  // Add click listeners to video preview buttons
  document.querySelectorAll('.video-preview-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const videoKey = this.getAttribute('data-video');
      const videoSrc = videoUrls[videoKey];
      if (videoSrc) {
        openVideoModal(videoSrc);
      }
    });
  });

  // Close modal when clicking outside video
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeVideoModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // Initialize Mobile Menu
  initMobileMenu();
});
