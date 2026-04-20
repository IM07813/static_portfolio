

initScrollAnimations();
initCursorGlow();
initParallaxCards();

// =============================================
// SCROLL ANIMATIONS (Intersection Observer)
// =============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".fade-in-section").forEach((el) =>
    observer.observe(el)
  );
}

// =============================================
// ACTIVE NAV HIGHLIGHT (scroll spy)
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");
  const mobileItems = document.querySelectorAll(".mobile-nav-item");

  function setActiveNav() {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 160) {
        current = sec.getAttribute("id");
      }
    });

    [...navItems, ...mobileItems].forEach((item) => {
      item.classList.toggle(
        "active",
        item.getAttribute("href") === "#" + current
      );
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

// =============================================
// MOBILE MENU
// =============================================
function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileItems = document.querySelectorAll(".mobile-nav-item");
  const body = document.body;

  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("active");
    toggle.classList.toggle("active");
    body.classList.toggle("menu-open", open);
  });

  mobileItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const href = item.getAttribute("href");

      mobileNav.classList.remove("active");
      toggle.classList.remove("active");
      body.classList.remove("menu-open");

      document.querySelectorAll(".nav-item, .mobile-nav-item").forEach((n) => {
        n.classList.toggle("active", n.getAttribute("href") === href);
      });

      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
      mobileNav.classList.remove("active");
      toggle.classList.remove("active");
      body.classList.remove("menu-open");
    }
  });

  // Collapse on resize back to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      mobileNav.classList.remove("active");
      toggle.classList.remove("active");
      body.classList.remove("menu-open");
    }
  });

  // Mobile nav-bg scroll effect
  const navBg = document.querySelector(".mobile-nav-bg");
  if (navBg) {
    const handleScroll = () =>
      navBg.classList.toggle("scrolled", window.scrollY > 5);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
}

// =============================================
// CURSOR GOLD GLOW (desktop only)
// =============================================
function initCursorGlow() {
  if (window.innerWidth < 768) return;

  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  Object.assign(glow.style, {
    position: "fixed",
    width: "340px",
    height: "340px",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: "1",
    background: "radial-gradient(circle, rgba(255,215,0,0.045) 0%, transparent 70%)",
    // FIX: transform:translate() runs on the GPU compositor thread — no layout reflow.
    // The old left/top approach caused a full layout reflow on EVERY mousemove event.
    transform: "translate(-500px, -500px)",
    top: "0",
    left: "0",
    willChange: "transform",
  });
  document.body.appendChild(glow);

  window.addEventListener("mousemove", (e) => {
    // translate() is composited on the GPU — essentially zero CPU cost
    glow.style.transform = `translate(${e.clientX - 170}px, ${e.clientY - 170}px)`;
  }, { passive: true });
}

// =============================================
// PARALLAX TILT ON CARDS (desktop only)
// =============================================
function initParallaxCards() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll(
    ".skill-card, .project-card, .certification-card, .contact-method"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 … 0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = -cy * 10;   // rotation x (tilt up/down)
      const ry = cx * 10;   // rotation y (tilt left/right)

      card.style.transform =
        `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.transition = "transform 0.1s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.25,1,0.5,1)";
    });
  });
}

// =============================================
// VIDEO MODAL
// =============================================
const videoUrls = {
  snapgorithm: "videos/snapgorithm_new_site_compressed.mp4",
  crm: "videos/farm_stack_agentic_CRM.mp4",
  realestate: "videos/realestate_pro.mp4",
  construction: "videos/contruction_site_portfolio.mp4",
  rag: "videos/rag_model_preview_compressed.mp4",
  "linkedin-scraper": "videos/linkedin_scrapper_preview_compressed.mp4",
};

function openVideoModal(src) {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");
  if (!modal || !video) return;

  video.src = src;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  video.play().catch(() => { });
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");
  if (!modal || !video) return;

  video.pause();
  video.src = "";
  modal.classList.remove("active", "minimized");
  document.body.style.overflow = "";
}

function minimizeVideo() {
  const modal = document.getElementById("videoModal");
  if (modal) modal.classList.toggle("minimized");
}

// =============================================
// TYPED TEXT EFFECT (for hero tag line prefix)
// =============================================
function initTypedPrefix() {
  const el = document.getElementById("typed-prefix");
  if (!el) return;

  const texts = ["< ", "{ ", "// "];
  const suffixes = [" />", " }", ""];
  let tIdx = 0, cIdx = 0, deleting = false;

  const suffixEl = document.getElementById("typed-suffix");

  function tick() {
    const full = texts[tIdx];
    if (!deleting) {
      cIdx++;
      el.textContent = full.slice(0, cIdx);
      if (suffixEl) suffixEl.textContent = suffixes[tIdx].slice(0, cIdx <= full.length ? cIdx : suffixes[tIdx].length);
      if (cIdx >= full.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      cIdx--;
      el.textContent = full.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % texts.length;
      }
    }
    setTimeout(tick, deleting ? 60 : 110);
  }
  tick();
}

// =============================================
// STAGGER CHILDREN ANIMATION
// =============================================
function initStaggerAnimations() {
  const grids = document.querySelectorAll(
    ".skills-grid, .projects-grid, .certifications-grid, .tools-grid"
  );

  grids.forEach((grid) => {
    const children = Array.from(grid.children);
    children.forEach((child, i) => {
      // Apply stagger delay only for the scroll-in entry animation
      child.style.transitionDelay = `${i * 60}ms`;

      // After the entry animation finishes, REMOVE the delay so
      // hover interactions (rise-up) are instant and equal for ALL items
      const clearDelay = () => {
        child.style.transitionDelay = "0ms";
      };

      // Clear after the longest possible stagger + transition duration
      const entryDuration = i * 60 + 900; // stagger offset + 0.85s fade-in
      setTimeout(clearDelay, entryDuration);
    });
  });
}

// =============================================
// SCROLL PROGRESS BAR
// =============================================
function initScrollProgress() {
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  Object.assign(bar.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "2px",
    width: "0%",
    background: "linear-gradient(90deg, #B8860B, #FFD700, #FFE55C)",
    zIndex: "9999",
    transition: "width 0.1s linear",
    pointerEvents: "none",
    boxShadow: "0 0 8px rgba(255,215,0,0.6)",
  });
  document.body.appendChild(bar);

  window.addEventListener(
    "scroll",
    () => {
      const pct =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      bar.style.width = Math.min(pct, 100) + "%";
    },
    { passive: true }
  );
}

// =============================================
// SCROLL TO TOP BUTTON
// =============================================
function initScrollToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  // Show/hide based on scroll position
  window.addEventListener("scroll", () => {
    // Show button when scrolled down more than a screen and a half roughly
    if (window.scrollY > window.innerHeight * 1.5) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  // Scroll abruptly but smoothly to top on click
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// =============================================
// INIT ALL
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  // Video modal
  const closeBtn = document.getElementById("closeBtn");
  const minimizeBtn = document.getElementById("minimizeBtn");
  const modal = document.getElementById("videoModal");

  if (closeBtn) closeBtn.addEventListener("click", closeVideoModal);
  if (minimizeBtn) minimizeBtn.addEventListener("click", minimizeVideo);

  document.querySelectorAll(".video-preview-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const src = videoUrls[this.dataset.video];
      if (src) openVideoModal(src);
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeVideoModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeVideoModal();
    }
  });

  // Nav
  initMobileMenu();

  // Scroll progress bar
  initScrollProgress();

  // Stagger delays
  initStaggerAnimations();

  // Typed prefix
  initTypedPrefix();

  // Scroll to top button
  initScrollToTop();

  // =============================================
  // PAGE VISIBILITY API — pause everything when tab is hidden
  // This gives 100% CPU savings when the user switches to another tab.
  // =============================================
  document.addEventListener("visibilitychange", () => {
    const hidden = document.hidden;
    // Pause all CSS animations site-wide
    document.body.style.animationPlayState = hidden ? "paused" : "running";
    // Pause animations on all animated children too
    document.querySelectorAll(
      ".role-text, .subtitle-text, .scroll-arrows span, .loader-dot, .desktop-nav::before"
    ).forEach(el => {
      el.style.animationPlayState = hidden ? "paused" : "running";
    });
  });
});
