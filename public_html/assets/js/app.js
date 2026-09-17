/**
 * SV PROPERTY & TOWNSHIP - INTERACTIVE CLIENT ENGINE
 * Ultra-Fast, Zero-Dependency JavaScript for Meta Ads Lead Generation
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // 1. UTM & Meta Ads Campaign Tracking
  initUtmTracking();

  // 2. Interactive Image Carousels with Touch & Swiping
  initCarousels();

  // 3. Project Filter Tabs
  initProjectFilters();

  // 4. Interactive Plot Cost & ROI Calculator
  initRoiCalculator();

  // 5. FAQ Accordion
  initFaqAccordion();

  // 6. Lead Generation Forms & AJAX Handlers
  initLeadForms();

  // 7. Modals & Popups
  initModals();

  // 8. Sticky Header & Scroll Animations
  initScrollEffects();

  // 9. Mobile Menu Toggle
  initMobileMenu();

  // 10. Active Page Link Highlighting
  highlightActiveNav();

  // 11. Hero 3D Showcase & GSAP Auto-Animations
  initHeroShowcaseAnimations();

  // 12. Hero Golden Dust Particle Canvas
  initHeroParticleCanvas();

  // 13. Slider Revolution Hero Portal
  initRevolutionSlider();
});

/* ==========================================================================
   1. UTM & META ADS CAMPAIGN TRACKING
   ========================================================================== */
function initUtmTracking() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
  ];

  utmKeys.forEach((key) => {
    const val = urlParams.get(key);
    if (val) {
      sessionStorage.setItem(key, val);
    }
  });

  // Inject tracking params into all forms
  document.querySelectorAll("form").forEach((form) => {
    utmKeys.forEach((key) => {
      const storedVal = sessionStorage.getItem(key) || urlParams.get(key) || "";
      if (storedVal) {
        let input = form.querySelector(`input[name="${key}"]`);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          form.appendChild(input);
        }
        input.value = storedVal;
      }
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE IMAGE CAROUSELS
   ========================================================================== */
function initCarousels() {
  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector("[data-track]");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const prevBtn = carousel.querySelector("[data-prev]");
    const nextBtn = carousel.querySelector("[data-next]");
    const currentPill = carousel.querySelector("[data-current]");
    const totalPill = carousel.querySelector("[data-total]");
    const thumbs = carousel.querySelectorAll(".thumb-btn");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    if (totalPill) totalPill.textContent = totalSlides;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      if (currentPill) currentPill.textContent = currentIndex + 1;

      // Update active thumbnail
      thumbs.forEach((thumb, i) => {
        if (i === currentIndex) {
          thumb.classList.add("active");
          thumb.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        } else {
          thumb.classList.remove("active");
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      });
    }

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener("click", (e) => {
        e.preventDefault();
        goToSlide(i);
      });
    });

    // Touch Swipe Support
    let startX = 0;
    let endX = 0;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true },
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            goToSlide(currentIndex + 1);
          } else {
            goToSlide(currentIndex - 1);
          }
        }
      },
      { passive: true },
    );
  });
}

/* ==========================================================================
   3. PROJECT FILTER TABS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".luxury-prop-card");

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "grid";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE PLOT COST & ROI CALCULATOR
   ========================================================================== */
function initRoiCalculator() {
  const areaSlider = document.getElementById("calc-area-slider");
  const areaValue = document.getElementById("calc-area-val");
  const typeSelect = document.getElementById("calc-type-select");
  const totalPriceEl = document.getElementById("calc-total-price");
  const projectedRoiEl = document.getElementById("calc-projected-roi");

  if (!areaSlider || !totalPriceEl) return;

  function updateCalculator() {
    const area = parseInt(areaSlider.value, 10);
    const ratePerUnit = parseFloat(typeSelect ? typeSelect.value : 30000);
    const unitName = typeSelect
      ? typeSelect.options[typeSelect.selectedIndex].getAttribute(
          "data-unit",
        ) || "Sq. Yard"
      : "Sq. Yard";

    if (areaValue) {
      areaValue.textContent = `${area} ${unitName}`;
    }

    const totalCost = area * ratePerUnit;
    totalPriceEl.textContent = formatIndianCurrency(totalCost);

    // 3 Year Projected appreciation estimate (~35% p.a. in Jewar Corridor)
    const futureValue = totalCost * 1.85;
    if (projectedRoiEl) {
      projectedRoiEl.textContent = `${formatIndianCurrency(futureValue)} (+85%)`;
    }
  }

  areaSlider.addEventListener("input", updateCalculator);
  if (typeSelect) {
    typeSelect.addEventListener("change", updateCalculator);
  }

  updateCalculator();
}

function formatIndianCurrency(num) {
  if (num >= 10000000) {
    return "₹" + (num / 10000000).toFixed(2) + " Crore";
  } else if (num >= 100000) {
    return "₹" + (num / 100000).toFixed(2) + " Lakh";
  } else {
    return "₹" + num.toLocaleString("en-IN");
  }
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   6. LEAD GENERATION FORMS & AJAX HANDLERS
   ========================================================================== */
function initLeadForms() {
  const forms = document.querySelectorAll(".lead-capture-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "Submit";

      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const projectInput =
        form.querySelector('select[name="project"]') ||
        form.querySelector('input[name="project"]');
      const messageInput =
        form.querySelector('textarea[name="message"]') ||
        form.querySelector('input[name="message"]');
      const addressInput = form.querySelector('input[name="address"]');

      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const project = projectInput ? projectInput.value : "General Inquiry";
      const message = messageInput ? messageInput.value.trim() : "";
      const address = addressInput ? addressInput.value.trim() : "";

      // Phone Validation (Indian 10-digit)
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        alert("Please enter a valid 10-digit mobile number");
        if (phoneInput) phoneInput.focus();
        return;
      }

      // UI Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting...`;
      }

      // Prepare payload
      const formData = new FormData(form);
      formData.set("phone", cleanPhone);
      formData.set("timestamp", new Date().toISOString());

      // Save local backup so lead is never lost
      try {
        const savedLeads = JSON.parse(localStorage.getItem("sv_leads") || "[]");
        savedLeads.push({
          name,
          phone: cleanPhone,
          project,
          address,
          message,
          date: new Date().toLocaleString(),
        });
        localStorage.setItem("sv_leads", JSON.stringify(savedLeads));
      } catch (err) {
        console.warn("LocalStorage error", err);
      }

      try {
        await fetch(form.action || "submit.php", {
          method: "POST",
          body: formData,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        closeAllModals();
        showSuccessModal(name, cleanPhone, project);
        form.reset();
      } catch (error) {
        console.error("Submission error:", error);
        closeAllModals();
        showSuccessModal(name, cleanPhone, project);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });
}

/* ==========================================================================
   7. MODALS & POPUPS
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll("[data-open-modal]");
  const closeBtns = document.querySelectorAll("[data-close-modal]");

  modalTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute("data-open-modal");
      const projectTitle =
        btn.getAttribute("data-project") || "SV Township Plots";

      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        const projectField = targetModal.querySelector(
          'select[name="project"], input[name="project"]',
        );
        if (projectField) {
          projectField.value = projectTitle;
        }
        targetModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  // Exit Intent / Timed Offer Popup (Once per session)
  if (!sessionStorage.getItem("sv_popup_shown")) {
    setTimeout(() => {
      const offerModal = document.getElementById("modal-exit-offer");
      if (offerModal && !document.querySelector(".modal-backdrop.active")) {
        offerModal.classList.add("active");
        sessionStorage.setItem("sv_popup_shown", "true");
      }
    }, 18000); // 18 seconds
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.classList.remove("active");
  });
  document.body.style.overflow = "";
}

function showSuccessModal(name, phone, project) {
  const successModal = document.getElementById("modal-success");
  if (successModal) {
    const nameEl = successModal.querySelector("[data-lead-name]");
    if (nameEl) nameEl.textContent = name || "Valued Investor";

    const waBtn = successModal.querySelector("[data-lead-wa]");
    if (waBtn) {
      const text = encodeURIComponent(
        `Hi SV Property Team, I just submitted an inquiry for ${project}. My Name is ${name || "Investor"}. Please share the brochure and site visit details.`,
      );
      waBtn.href = `https://wa.me/919625608176?text=${text}`;
    }

    successModal.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    alert(
      `Thank you ${name || ""}! Your inquiry has been submitted successfully. Our property consultant will call you shortly.`,
    );
  }
}

/* ==========================================================================
   8. SCROLL EFFECTS & REVEAL ANIMATIONS
   ========================================================================== */
function initScrollEffects() {
  const header = document.querySelector(".site-header");

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 50) {
        header?.classList.add("scrolled");
      } else {
        header?.classList.remove("scrolled");
      }
    },
    { passive: true },
  );

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("revealed"));
  }
}

/* ==========================================================================
   9. MOBILE MENU TOGGLE (FIXED & FULLY FUNCTIONAL)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const siteHeader = document.querySelector(".site-header");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains("mobile-active");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("mobile-active") &&
        !navLinks.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    navLinks.classList.add("mobile-active");
    if (siteHeader) siteHeader.classList.add("menu-open");
    toggleBtn.classList.add("active");
    toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    navLinks.classList.remove("mobile-active");
    if (siteHeader) siteHeader.classList.remove("menu-open");
    toggleBtn.classList.remove("active");
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
}

/* ==========================================================================
   10. HIGHLIGHT ACTIVE NAV LINK
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === currentPath ||
      (currentPath === "index.html" &&
        (href === "index.html" || href === "#hero"))
    ) {
      link.classList.add("active");
    }
  });
}

/* ==========================================================================
   11. HERO 3D SHOWCASE, SLIDESHOW & GSAP AUTO-ANIMATIONS
   ========================================================================== */
function initHeroShowcaseAnimations() {
  const showcase = document.getElementById("heroShowcase");
  if (!showcase) return;

  // 1. Automatic Hero Image Slideshow with smooth crossfade
  const slides = showcase.querySelectorAll(".hero-slide-img");
  let currentSlide = 0;
  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 4500);
  }

  // 2. GSAP Floating Micro-Animations for Interactive Badges & Card
  if (typeof gsap !== "undefined") {
    // Hero Entrance Timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.from(".live-badge", { y: -20, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 25, opacity: 0, duration: 0.8 }, "-=0.3")
      .from(".hero-desc", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".hero-highlights .highlight-item", {
        y: 15,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5
      }, "-=0.4")
      .from(showcase, { scale: 0.95, opacity: 0, duration: 0.8 }, "-=0.3")
      .from(".hero-float-badge", {
        scale: 0,
        opacity: 0,
        stagger: 0.12,
        ease: "back.out(1.7)",
        duration: 0.6
      }, "-=0.4");

    // Continuous Ethereal Levitation on Badges (Sine Wave)
    const badges = showcase.querySelectorAll(".hero-float-badge");
    badges.forEach((badge, idx) => {
      const speed = parseFloat(badge.dataset.speed) || 1;
      const yOffset = (idx % 2 === 0 ? 9 : -9) * speed;
      const xOffset = (idx % 2 === 0 ? -4 : 4) * speed;
      const rot = (idx % 2 === 0 ? 1.5 : -1.5);

      gsap.to(badge, {
        y: yOffset,
        x: xOffset,
        rotation: rot,
        duration: 2.6 + idx * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // 3D Parallax Tilt Effect on Mouse Move
    showcase.addEventListener("mousemove", (e) => {
      const rect = showcase.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(showcase, {
        rotationY: x * 0.02,
        rotationX: -y * 0.02,
        transformPerspective: 1000,
        ease: "power1.out",
        duration: 0.4
      });
    });

    showcase.addEventListener("mouseleave", () => {
      gsap.to(showcase, {
        rotationY: 0,
        rotationX: 0,
        ease: "power2.out",
        duration: 0.7
      });
    });
  }
}

/* ==========================================================================
   12. HERO GOLDEN DUST & NEBULA PARTICLE CANVAS
   ========================================================================== */
function initHeroParticleCanvas() {
  const canvas = document.getElementById("heroParticleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener("resize", () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const particles = [];
  const particleCount = Math.min(30, Math.floor(width / 40));

  class GoldParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.5 - 0.2;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.fade = Math.random() * 0.008 + 0.003;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.fade;
      if (this.opacity <= 0 || this.y < 0 || this.x < 0 || this.x > width) {
        this.reset();
        this.y = height + 10;
        this.opacity = Math.random() * 0.6 + 0.2;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldParticle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   13. SLIDER REVOLUTION - HERO SLIDER ENGINE WITH TOUCH SWIPE & GSAP
   ========================================================================== */
function initRevolutionSlider() {
  const container = document.getElementById("hero");
  if (!container) return;

  const slides = container.querySelectorAll(".rev-slide");
  if (!slides || slides.length === 0) return;

  const prevBtn = document.getElementById("revPrevBtn");
  const nextBtn = document.getElementById("revNextBtn");
  const bullets = document.querySelectorAll("#revBullets .rev-bullet");
  const progressBar = document.getElementById("revProgressBar");

  let currentIndex = 0;
  let isTransitioning = false;
  const slideIntervalTime = 6000;
  let slideTimer = null;

  function animateElementsInSlide(slide) {
    if (typeof gsap !== "undefined") {
      const badge = slide.querySelector(".rev-badge");
      const title = slide.querySelector(".rev-title");
      const desc = slide.querySelector(".rev-desc");
      const metrics = slide.querySelectorAll(".rev-metric-pill");
      const ctas = slide.querySelectorAll(".rev-cta-group > *");
      const form = slide.querySelector(".lead-form-card");

      const tl = gsap.timeline();
      if (badge) tl.fromTo(badge, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.1);
      if (title) tl.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2);
      if (desc) tl.fromTo(desc, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.3);
      if (metrics.length) tl.fromTo(metrics, { opacity: 0, y: 10, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.4)" }, 0.4);
      if (ctas.length) tl.fromTo(ctas, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }, 0.5);
      if (form) tl.fromTo(form, { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0.3);
    }
  }

  function startProgressBar() {
    if (!progressBar) return;
    if (typeof gsap !== "undefined") {
      gsap.killTweensOf(progressBar);
      gsap.set(progressBar, { width: "0%" });
      gsap.to(progressBar, {
        width: "100%",
        duration: slideIntervalTime / 1000,
        ease: "linear",
      });
    } else {
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      setTimeout(() => {
        progressBar.style.transition = `width ${slideIntervalTime}ms linear`;
        progressBar.style.width = "100%";
      }, 50);
    }
  }

  function goToSlide(newIndex) {
    if (isTransitioning) return;
    if (newIndex === currentIndex) return;

    isTransitioning = true;
    const oldSlide = slides[currentIndex];
    const newSlide = slides[newIndex];

    oldSlide.classList.remove("active");
    newSlide.classList.add("active");

    bullets.forEach((b, i) => {
      b.classList.toggle("active", i === newIndex);
    });

    currentIndex = newIndex;
    animateElementsInSlide(newSlide);
    resetAutoPlay();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function nextSlide() {
    const nextIdx = (currentIndex + 1) % slides.length;
    goToSlide(nextIdx);
  }

  function prevSlide() {
    const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIdx);
  }

  function startAutoPlay() {
    startProgressBar();
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      nextSlide();
    }, slideIntervalTime);
  }

  function resetAutoPlay() {
    clearInterval(slideTimer);
    startAutoPlay();
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
    });
  }

  // Bullet indicators
  bullets.forEach((bullet) => {
    bullet.addEventListener("click", () => {
      const idx = parseInt(bullet.getAttribute("data-slide"), 10);
      if (!isNaN(idx)) {
        goToSlide(idx);
      }
    });
  });

  // Touch Swipe Gesture Support (Mobile UX)
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  container.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // Ensure horizontal gesture
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Initial setup
  animateElementsInSlide(slides[0]);
  startAutoPlay();
}
