import { setStoredTheme } from "@/lib/storage";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initTheme() {
  window.addEventListener("set-theme", (e) => {
    const theme = (e as CustomEvent<{ theme: "dark" | "light" }>).detail.theme;
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.classList.toggle("light", theme === "light");
    setStoredTheme(theme);
    window.setTimeout(() => root.classList.remove("theme-anim"), 550);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  });
}

async function initLenis() {
  if (reducedMotion()) return;
  try {
    const { default: Lenis } = await import("lenis");
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } catch {
    /* lenis optional */
  }
}

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>(".reveal");
  if (els.length === 0) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  els.forEach((el) => io.observe(el));
}

function initCopyButtons() {
  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-copy]");
    if (!target) return;
    const value = target.dataset.copy ?? "";
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => {
        target.classList.add("copied");
        target.dispatchEvent(new CustomEvent("copied", { bubbles: true }));
        setTimeout(() => target.classList.remove("copied"), 1600);
      })
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch {
          /* noop */
        }
        ta.remove();
      });
  });
}

function initCmdk() {
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("open-cmdk"));
    }
  });
}

function initTilt() {
  if (reducedMotion()) return;
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    let raf = 0;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
      });
    });
    card.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  });
}

function initSpotlight() {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll<HTMLElement>(".spotlight-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}

function initMagnetic() {
  if (reducedMotion()) return;
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
    let raf = 0;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${(x * 7).toFixed(2)}px, ${(y * 5).toFixed(2)}px)`;
      });
    });
    el.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    });
  });
}

function initCounters() {
  const els = document.querySelectorAll<HTMLElement>("[data-count]");
  if (els.length === 0) return;
  const animate = (el: HTMLElement) => {
    const target = Number(el.dataset.count ?? "0");
    const suffix = el.dataset.countSuffix ?? "";
    const decimals = Number(el.dataset.countDecimals ?? "0");
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animate(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}

function initCursorGlow() {
  if (reducedMotion()) return;
  if (window.matchMedia("(hover: none)").matches) return;
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;
  let raf = 0;
  let tx = 0;
  let ty = 0;
  window.addEventListener(
    "mousemove",
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          glow.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
          glow.style.opacity = "1";
          raf = 0;
        });
      }
    },
    { passive: true },
  );
  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  const onScroll = () => {
    btn.classList.toggle("is-visible", window.scrollY > 560);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  });
}

function initParallax() {
  if (reducedMotion()) return;
  const layers = document.querySelectorAll<HTMLElement>("[data-parallax]");
  if (layers.length === 0) return;
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        for (const layer of layers) {
          const speed = Number(layer.dataset.parallax ?? "0.2");
          const rect = layer.parentElement?.getBoundingClientRect();
          if (!rect) continue;
          if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
          layer.style.transform = `translate3d(0, ${((window.innerHeight - rect.top) * speed).toFixed(1)}px, 0)`;
        }
        ticking = false;
      });
    },
    { passive: true },
  );
}

function initScrollProgress() {
  if (document.querySelector(".scroll-progress")) return;
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : "0%";
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

const SCRAMBLE_CHARS = "@#$%&*+=<>ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function initDecodeText() {
  document.querySelectorAll<HTMLElement>(".scramble-text").forEach((el) => {
    if (el.dataset.decodeBound === "true") return;
    el.dataset.decodeBound = "true";
    const text = el.textContent ?? "";
    el.textContent = "";
    el.setAttribute("aria-label", text);
    for (const ch of text) {
      const span = document.createElement("span");
      span.dataset.char = ch === " " ? "space" : "letter";
      span.textContent = ch === " " ? "\u00A0" : ch;
      if (ch === " ") span.style.width = "0.28em";
      el.appendChild(span);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          el.querySelectorAll<HTMLElement>("[data-char]").forEach((span, i) => {
            const target = span.textContent ?? "";
            if (span.dataset.char === "space") return;
            const revealAt = 80 + i * 45;
            const scrambleStart = performance.now() + revealAt - 260;
            const tick = (now: number) => {
              if (now < scrambleStart) {
                span.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                requestAnimationFrame(tick);
              } else {
                span.textContent = target;
              }
            };
            requestAnimationFrame(tick);
          });
          window.setTimeout(() => el.classList.add("is-decoded"), 60);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
  });
}

function initLockTilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll<HTMLElement>(".lock-tilt").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--lx", `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
      el.style.setProperty("--ly", `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
    });
  });
}

function initPrefetchFallback() {
  document.addEventListener(
    "pointerenter",
    (e) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='/']");
      if (a instanceof HTMLAnchorElement && !a.hasAttribute("data-prefetched")) {
        a.setAttribute("data-prefetched", "true");
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = a.href;
        document.head.appendChild(link);
      }
    },
    { capture: true, passive: true },
  );
}

initTheme();
initLenis();
initReveal();
initCopyButtons();
initCmdk();
initTilt();
initSpotlight();
initMagnetic();
initCounters();
initCursorGlow();
initBackToTop();
initParallax();
initScrollProgress();
initDecodeText();
initLockTilt();
initPrefetchFallback();
