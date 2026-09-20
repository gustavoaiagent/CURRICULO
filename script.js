document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
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

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = el.getAttribute("data-delay");
        if (delay) el.style.setProperty("--delay", `${delay}ms`);
        el.classList.add("is-visible");
        observer.unobserve(el);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -36px 0px" }
  );
  reveals.forEach((el) => observer.observe(el));

  const sections = document.querySelectorAll("section[id], header[id]");
  const linkMap = new Map(
    [...(navLinks?.querySelectorAll("a") || [])]
      .filter((a) => a.getAttribute("href")?.startsWith("#"))
      .map((a) => [a.getAttribute("href")?.slice(1), a])
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        linkMap.forEach((anchor, key) => {
          if (key === "topo") return;
          anchor.classList.toggle("is-active", key === id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  document.getElementById("backTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
