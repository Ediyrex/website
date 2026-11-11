import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initAboutAnimations(rootEl: HTMLElement): () => void {
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
    // 1. Header entrance
    const header = rootEl.querySelector("[data-about-header]");
    if (header) {
      gsap.from(header, {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: header,
          start: "top 88%",
          once: true,
        },
      });
    }

    // 2. Manifesto line-by-line reveal
    const manifestoLines = rootEl.querySelectorAll(
      "[data-about-manifesto-line]"
    );
    if (manifestoLines.length > 0) {
      gsap.from(manifestoLines, {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: manifestoLines[0],
          start: "top 86%",
          once: true,
        },
      });
    }

    // 3. Purpose card image/statement entrance
    const purpose = rootEl.querySelector("[data-about-purpose]");
    if (purpose) {
      gsap.from(purpose, {
        opacity: 0,
        y: 26,
        scale: 0.985,
        duration: 1.0,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: purpose,
          start: "top 86%",
          once: true,
        },
      });
    }

    // 4. Big Problem card entrance
    const problem = rootEl.querySelector("[data-about-problem]");
    if (problem) {
      gsap.from(problem, {
        opacity: 0,
        y: 22,
        duration: 0.8,
        delay: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: problem,
          start: "top 86%",
          once: true,
        },
      });
    }

    // 5. Our Divisions four-column sequential reveal
    const divisionCols = rootEl.querySelectorAll("[data-about-division-col]");
    if (divisionCols.length > 0) {
      gsap.from(divisionCols, {
        opacity: 0,
        y: 20,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: divisionCols[0],
          start: "top 86%",
          once: true,
        },
      });
    }

    // 6. Bottom bento row: Founder, Built On, Studio Stats, Location
    const bottomCards = [
      rootEl.querySelector("[data-about-founder]"),
      rootEl.querySelector("[data-about-tech]"),
      rootEl.querySelector("[data-about-stats]"),
      rootEl.querySelector("[data-about-location]"),
    ].filter((el): el is Element => el !== null);

    if (bottomCards.length > 0) {
      gsap.from(bottomCards, {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: bottomCards[0],
          start: "top 86%",
          once: true,
        },
      });
    }
  }, rootEl);

  return () => ctx.revert();
}

