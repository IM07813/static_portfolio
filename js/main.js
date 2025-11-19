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
      animateProgressBars();
    }, 1000);
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
  for (let i = 0; i < 20000; i++) {
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
  const diskGeometry = new THREE.RingGeometry(1.6, 4, 128);
  const diskMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      innerColor: { value: new THREE.Color(0xffffee) }, // Hotter inner edge
      outerColor: { value: new THREE.Color(0xff8800) }, // Cooler outer edge
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            uniform vec3 innerColor;
            uniform vec3 outerColor;

            // 2D simplex noise function
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m;
                m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                float radius = distance(vUv, vec2(0.5));
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);

                // Create turbulence with noise
                float noise = snoise(vUv * 10.0 + vec2(time * 0.2, 0.0));

                // Mix colors based on radius
                vec3 color = mix(innerColor, outerColor, radius * 2.0);

                // Add noise to color and brightness
                color += noise * 0.1;

                // Fade out at the edges
                float alpha = smoothstep(0.0, 0.1, radius) * (1.0 - smoothstep(0.45, 0.5, radius));
                alpha *= 0.8; // Make it slightly transparent

                gl_FragColor = vec4(color, alpha);
            }
        `,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
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

// Progress bar animations
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".skill-progress-fill");

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.style.width;

          // Reset width to 0 and animate to target
          progressBar.style.width = "0%";
          progressBar.style.transition = "width 2s ease-in-out";

          setTimeout(() => {
            progressBar.style.width = targetWidth;
          }, 200);

          // Unobserve after animation
          progressObserver.unobserve(progressBar);
        }
      });
    },
    { threshold: 0.5 },
  );

  progressBars.forEach((bar) => {
    progressObserver.observe(bar);
  });
}

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
    localStorage: typeof Storage !== 'undefined',
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

