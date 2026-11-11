import { gsap, ScrollTrigger } from "@/lib/gsap";

export function initSelectedWorkAnimations(rootEl: HTMLElement): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) {
    return () => {};
  }

  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    // 1. Editorial Header & Filters Entrance
    const label = rootEl.querySelector("[data-sw-label]");
    if (label) {
      gsap.from(label, {
        opacity: 0,
        y: 12,
        duration: 0.65,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: label,
          start: "top 88%",
          once: true,
        },
      });
    }

    const headlineLines = rootEl.querySelectorAll("[data-sw-headline-line]");
    if (headlineLines.length > 0) {
      gsap.from(headlineLines, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: headlineLines[0],
          start: "top 86%",
          once: true,
        },
      });
    }

    const intro = rootEl.querySelector("[data-sw-intro]");
    if (intro) {
      gsap.from(intro, {
        opacity: 0,
        y: 18,
        duration: 0.75,
        delay: 0.15,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: intro,
          start: "top 88%",
          once: true,
        },
      });
    }

    const filters = rootEl.querySelectorAll("[data-sw-filters] > button");
    if (filters.length > 0) {
      gsap.from(filters, {
        opacity: 0,
        y: 14,
        duration: 0.55,
        stagger: 0.05,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: filters[0],
          start: "top 90%",
          once: true,
        },
      });
    }

    // 2. Featured Case Study Sequence
    const featured = rootEl.querySelector("[data-sw-featured]");
    if (featured) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featured,
          start: "top 85%",
          once: true,
        },
      });

      tl.from(featured, {
        opacity: 0,
        y: 24,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      const glow = featured.querySelector("[data-sw-featured-glow]");
      if (glow) {
        tl.from(
          glow,
          {
            opacity: 0,
            scale: 0.9,
            duration: 0.9,
            ease: "power2.out",
            clearProps: "opacity,scale",
          },
          0.1
        );
      }

      const mainPanel = featured.querySelector("[data-sw-featured-mainpanel]");
      if (mainPanel) {
        tl.from(
          mainPanel,
          {
            opacity: 0,
            y: 20,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "opacity,y",
          },
          0.18
        );
      }

      const subPanels = featured.querySelectorAll("[data-sw-featured-subpanel]");
      if (subPanels.length > 0) {
        tl.from(
          subPanels,
          {
            opacity: 0,
            y: 16,
            stagger: 0.1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "opacity,y",
          },
          0.26
        );
      }

      const lines = featured.querySelectorAll<SVGGeometryElement>(
        "[data-sw-featured-line]"
      );
      lines.forEach((line, idx) => {
        const len =
          typeof line.getTotalLength === "function"
            ? line.getTotalLength()
            : 120;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(
          line,
          { strokeDashoffset: 0, duration: 0.85, ease: "power3.out" },
          0.34 + idx * 0.08
        );
      });
    }

    // 3. Supporting Project Gallery Stagger (100ms apart)
    const cards = rootEl.querySelectorAll("[data-sw-card]");
    if (cards.length > 0) {
      gsap.from(cards, {
        opacity: 0,
        y: 20,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: cards[0],
          start: "top 86%",
          once: true,
        },
      });
    }

    // 4. Impact Statistics Count-Up
    const statsStrip = rootEl.querySelector("[data-sw-stats]");
    if (statsStrip) {
      const counters = statsStrip.querySelectorAll<HTMLElement>(
        "[data-sw-counter-target]"
      );

      gsap.from(statsStrip, {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: statsStrip,
          start: "top 88%",
          once: true,
          onEnter: () => {
            counters.forEach((el) => {
              const target = Number(el.dataset.swCounterTarget || "0");
              const suffix = el.dataset.swCounterSuffix || "";
              const proxy = { val: 0 };
              gsap.to(proxy, {
                val: target,
                duration: 1.15,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = `${Math.round(proxy.val)}${suffix}`;
                },
              });
            });
          },
        },
      });
    }
  }, rootEl);

  return () => ctx.revert();
}

