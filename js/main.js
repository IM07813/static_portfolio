// Loading screen management
let isLoading = true;
let loadingScreen;
let resourcesLoaded = 0;
let totalResources = 0;

function initializeLoading() {
  loadingScreen = document.getElementById("loading-screen");

  // Count resources to load
  const images = document.querySelectorAll("img");
  const scripts = document.querySelectorAll("script[src]");
  totalResources = images.length + scripts.length + 1; // +1 for Three.js scene

  // Monitor image loading
  images.forEach((img) => {
    if (img.complete) {
      resourcesLoaded++;
    } else {
      img.addEventListener("load", () => {
        resourcesLoaded++;
        checkLoadingComplete();
      });
      img.addEventListener("error", () => {
        resourcesLoaded++;
        checkLoadingComplete();
      });
    }
  });

  // Monitor script loading
  scripts.forEach((script) => {
    script.addEventListener("load", () => {
      resourcesLoaded++;
      checkLoadingComplete();
    });
    script.addEventListener("error", () => {
      resourcesLoaded++;
      checkLoadingComplete();
    });
  });

  // Start minimum loading time
  setTimeout(() => {
    resourcesLoaded++;
    checkLoadingComplete();
  }, 2000); // Minimum 2 seconds loading time
}

function checkLoadingComplete() {
  if (resourcesLoaded >= totalResources && isLoading) {
    setTimeout(() => {
      hideLoadingScreen();
    }, 500); // Small delay for smooth transition
  }
}

function hideLoadingScreen() {
  if (loadingScreen) {
    loadingScreen.classList.add("hidden");
    isLoading = false;

    // Remove loading screen after transition
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);

    // Start animations after loading screen is hidden
    setTimeout(() => {
      initScrollAnimations();
    }, 500);
  }
}

// Three.js black hole setup

let scene, camera, renderer, stars, blackHole, accretionDisk;
let blackHoleGroup = new THREE.Group();

// Create circular star texture to fix square star bug
function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  // Create radial gradient for circular star
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function init() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("threejs-container").appendChild(renderer.domElement);

  camera.position.z = 10;

  // --- Starfield ---
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  const starCount = window.innerWidth < 768 ? 8000 : 15000; // Optimize for mobile
  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3),
  );
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    alphaTest: 0.1,
    map: createStarTexture()
  });
  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // --- Black Hole ---
  // The black hole itself is a sphere that will have a gravitational lensing shader
  const blackHoleGeometry = new THREE.SphereGeometry(1.5, 64, 64);
  const blackHoleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform float time;
            uniform vec2 resolution;
            varying vec2 vUv;

            void main() {
                vec2 center = vec2(0.5, 0.5);
                float dist = distance(vUv, center);
                // Simple dark center, you can make this more complex for lensing
                float strength = smoothstep(0.5, 0.45, dist);
                gl_FragColor = vec4(vec3(0.0), strength);
            }
        `,
    transparent: true,
  });
  blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
  blackHoleGroup.add(blackHole);

  // --- Accretion Disk ---
  const diskGeometry = new THREE.RingGeometry(1.6, 4, 256, 64);
  const diskMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      diskColor: { value: new THREE.Color(0x00ffff) }, // Cyan glow color
    },
    vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            uniform vec3 diskColor;

            void main() {
                vec2 center = vec2(0.5, 0.5);
                float radius = distance(vUv, center);
                
                // Smooth radial gradient from inner to outer edge
                float gradient = smoothstep(0.0, 0.5, radius);
                
                // Create smooth rotating brightness variation
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                float rotation = sin(angle * 3.0 + time * 0.5) * 0.15 + 0.85;
                
                // Smooth color with subtle variation
                vec3 color = diskColor * rotation;
                
                // Smooth edge fade
                float innerFade = smoothstep(0.0, 0.15, radius);
                float outerFade = 1.0 - smoothstep(0.4, 0.5, radius);
                float alpha = innerFade * outerFade * 0.7;
                
                // Add subtle glow
                alpha += (1.0 - gradient) * 0.2;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
  accretionDisk.rotation.x = Math.PI / 2.2; // Tilt the disk
  blackHoleGroup.add(accretionDisk);

  scene.add(blackHoleGroup);

  // Mouse interaction
  document.addEventListener("mousemove", onMouseMove, false);

  // Mark Three.js as loaded
  resourcesLoaded++;
  checkLoadingComplete();
}

let mouseX = 0,
  mouseY = 0;
function onMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) / 100;
  mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function animate() {
  if (document.hidden) {
    setTimeout(() => requestAnimationFrame(animate), 500); // Check less frequently when hidden
    return;
  }
  requestAnimationFrame(animate);

  const time = Date.now() * 0.0001;

  // Update shader uniforms
  if (accretionDisk && blackHole) {
    accretionDisk.material.uniforms.time.value = time;
    blackHole.material.uniforms.time.value = time;
  }

  // Rotate the starfield slowly
  if (stars) {
    stars.rotation.y += 0.0001;
  }

  // Rotate the black hole system
  if (blackHoleGroup) {
    blackHoleGroup.rotation.y += 0.001;
    blackHoleGroup.rotation.z += 0.0005;
  }

  // Camera movement based on mouse
  if (camera) {
    camera.position.x += (mouseX - camera.position.x) * 0.01;
    camera.position.y += (-mouseY - camera.position.y) * 0.01;
    camera.lookAt(scene.position);
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  if (camera && renderer && blackHole) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    blackHole.material.uniforms.resolution.value.x = renderer.domElement.width;
    blackHole.material.uniforms.resolution.value.y = renderer.domElement.height;
  }
}

window.addEventListener("resize", onWindowResize, false);

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

// Removed scramble effect - now using pure CSS fade animation

// Navigation and scrolling
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href").substring(1) === entry.target.id) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: '-100px 0px -100px 0px'
  },
);

sections.forEach((section) => observer.observe(section));

navLinks.forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
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
  const browserFeatures = checkBrowserCompatibility();

  // Initialize loading screen
  initializeLoading();

  // Initialize Three.js
  if (typeof THREE !== "undefined") {
    init();
    animate();
  }

});

// Fallback in case resources don't load properly
window.addEventListener("load", function () {
  setTimeout(() => {
    if (isLoading) {
      hideLoadingScreen();
    }

  }, 5000); // Maximum 5 seconds loading time
});


// Video Modal Functionality
const videoUrls = {
  'snapgorithm': 'videos/snapgorithm_compressed.mp4',
  'crm': 'videos/farm_stack_agentic_CRM.mp4',
  'realestate': 'videos/realestate_pro.mp4',
  'construction': 'videos/contruction_site_portfolio.mp4'
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
    item.addEventListener('click', function () {
      mobileNav.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      body.classList.remove('menu-open');

      // Update active state
      document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(navItem => {
        navItem.classList.remove('active');
      });
      this.classList.add('active');

      // Also update desktop nav
      const href = this.getAttribute('href');
      const desktopNavItem = document.querySelector(`.nav-item[href="${href}"]`);
      if (desktopNavItem) {
        desktopNavItem.classList.add('active');
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
      if (window.scrollY > 50) {
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
