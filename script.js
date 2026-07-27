/**
 * script.js
 * Small, dependency-free enhancements for the portfolio site:
 *   1. Mobile nav toggle
 *   2. Active nav-link highlighting while scrolling
 *   3. Scroll-reveal animation for sections/cards (skipped if the visitor
 *      prefers reduced motion)
 *   4. Contact form -> mailto handoff + lightweight validation feedback
 *   5. Footer year
 *
 * Everything here is progressive enhancement: the page is fully readable
 * and navigable with JS disabled (see the ".no-js" fallback in style.css).
 */

document.documentElement.classList.remove("no-js");

/* -------------------------------------------------------------------- */
/* 1. Mobile nav toggle                                                  */
/* -------------------------------------------------------------------- */
(function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after tapping a link (mobile UX nicety)
  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

/* -------------------------------------------------------------------- */
/* 2. Active nav-link highlighting                                       */
/* -------------------------------------------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const linkFor = (id) =>
    document.querySelector(`.nav-link[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove("is-active"));
        const activeLink = linkFor(entry.target.id);
        if (activeLink) activeLink.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* -------------------------------------------------------------------- */
/* 3. Scroll-reveal animation                                            */
/* -------------------------------------------------------------------- */
(function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const targets = document.querySelectorAll(
    ".section-tag, .section-title, .card, .skill-group, .about-copy, .about-facts"
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    // Skip the animation entirely; content is already visible by default.
    return;
  }

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* -------------------------------------------------------------------- */
/* 4. Contact form                                                       */
/* -------------------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      note.textContent = "Please fill in every field with a valid email.";
      note.classList.remove("is-success");
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // EDIT ME: this is a static site with no backend, so we hand off to
    // the visitor's email client via mailto:. Replace this block with a
    // fetch() call to a form service (Formspree, EmailJS, etc.) if you
    // want submissions to happen without leaving the page.
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;

    note.textContent = "Opening your email client…";
    note.classList.add("is-success");
    form.reset();
  });
})();

/* -------------------------------------------------------------------- */
/* 5. Footer year                                                        */
/* -------------------------------------------------------------------- */
(function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
