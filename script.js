document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  navToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(Boolean(open)));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll reveal + language bars
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = el.getAttribute("data-delay");
        if (delay) el.style.setProperty("--delay", `${delay}ms`);
        el.classList.add("is-visible");

        if (el.classList.contains("lang")) {
          const level = el.getAttribute("data-level") || "0";
          el.style.setProperty("--level", `${level}%`);
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));

  // Active nav link by section
  const sections = document.querySelectorAll("section[id], header[id]");
  const linkMap = new Map(
    [...(navLinks?.querySelectorAll("a") || [])].map((a) => [
      a.getAttribute("href")?.slice(1),
      a,
    ])
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        linkMap.forEach((anchor, key) => {
          anchor.classList.toggle("is-active", key === id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // Soft parallax on hero photo
  const photo = document.querySelector(".hero__photo");
  const media = document.querySelector(".hero__media");
  if (photo && media && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    media.addEventListener("pointermove", (e) => {
      const rect = media.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      photo.style.transform = `scale(1.03) translate(${x * 4}px, ${y * 4}px)`;
    });
    media.addEventListener("pointerleave", () => {
      photo.style.transform = "";
    });
  }

  document.getElementById("backTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Profile photo fallback
  const profilePhoto = document.getElementById("profilePhoto");
  const photoFallback = document.getElementById("photoFallback");
  if (profilePhoto && photoFallback) {
    const showFallback = () => {
      profilePhoto.style.display = "none";
      photoFallback.hidden = false;
    };
    profilePhoto.addEventListener("error", showFallback);
    if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
      showFallback();
    }
  }
});
