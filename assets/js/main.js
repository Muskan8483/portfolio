
/* ===== Portfolio interactions ===== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const year = document.getElementById("current-year");
  const contactForm = document.getElementById("contact-form");

  /* Footer year */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* Header appearance on scroll */
  function updateHeader() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* Mobile navigation */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }

  /* Highlight the active navigation link */
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navItems.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", active);
          });
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* Reveal elements as they enter the viewport */
  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  /* Dreamy cosmic parallax */
  const cosmicBg = document.getElementById("dreamy-cosmos");

  if (cosmicBg && !reducedMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetScroll = 0;
    let currentScroll = 0;
    let animationFrame = null;

    function animateCosmos() {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      currentScroll += (targetScroll - currentScroll) * 0.07;

      cosmicBg.style.setProperty("--parallax-x", `${currentX}px`);
      cosmicBg.style.setProperty("--parallax-y", `${currentY}px`);
      cosmicBg.style.setProperty("--scroll-y", `${currentScroll}px`);

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1 ||
        Math.abs(targetScroll - currentScroll) > 0.1
      ) {
        animationFrame = requestAnimationFrame(animateCosmos);
      } else {
        animationFrame = null;
      }
    }

    function requestCosmosUpdate() {
      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(animateCosmos);
      }
    }

    function handleMouseMove(event) {
      targetX = (event.clientX / window.innerWidth - 0.5) * 18;
      targetY = (event.clientY / window.innerHeight - 0.5) * 18;
      requestCosmosUpdate();
    }

    function handleScroll() {
      targetScroll = Math.max(-100, -window.scrollY * 0.07);
      requestCosmosUpdate();
    }

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true
    });

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    window.addEventListener("resize", handleScroll, {
      passive: true
    });

    handleScroll();
  }

  /* Contact form: open the visitor's email application */
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("contact-name")?.value.trim();
      const email = document.getElementById("contact-email")?.value.trim();
      const message = document.getElementById("contact-message")?.value.trim();

      if (!name || !email || !message) {
        contactForm.reportValidity();
        return;
      }

      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      window.location.href =
        `mailto:vmuskan447@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
