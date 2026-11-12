import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function initStandardsAnimations(container: HTMLElement | null) {
  if (!container || typeof window === "undefined") {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    const header = container.querySelector("[data-brutal-header]");
    const headlines = container.querySelectorAll("[data-brutal-headline]");
    const wipe = container.querySelector("[data-brutal-wipe]");
    const fades = container.querySelectorAll("[data-brutal-fade]");
    const cards = container.querySelectorAll("[data-brutal-card]");
    const numbers = container.querySelectorAll("[data-brutal-number]");
    const photo = container.querySelector("[data-brutal-photo]");
    const svgPaths = container.querySelectorAll("[data-brutal-svg]");

    svgPaths.forEach((node) => {
      const path = node as SVGGeometryElement;
      if (typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 86%",
        once: true,
      },
    });

    if (header) {
      tl.from(header, {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    }

    if (headlines.length > 0) {
      tl.from(
        headlines,
        {
          opacity: 0,
          y: 26,
          duration: 0.58,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.2"
      );
    }

    if (wipe) {
      tl.from(
        wipe,
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.45,
          ease: "power3.out",
          clearProps: "transform",
        },
        "-=0.3"
      );
    }

    if (fades.length > 0) {
      tl.from(
        fades,
        {
          opacity: 0,
          y: 14,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
        "-=0.25"
      );
    }

    if (cards.length > 0) {
      tl.from(
        cards,
        {
          opacity: 0,
          y: 22,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        0.18
      );
    }

    if (numbers.length > 0) {
      tl.from(
        numbers,
        {
          clipPath: "inset(100% 0 0 0)",
          y: 16,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "clipPath,transform",
        },
        0.24
      );
    }

    if (photo) {
      tl.from(
        photo,
        {
          clipPath: "inset(0 0 0 100%)",
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "clipPath,opacity",
        },
        0.3
      );
    }

    if (svgPaths.length > 0) {
      tl.to(
        svgPaths,
        {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
        },
        0.45
      );
    }
  }, container);

  const refreshTimer = window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);

  return () => {
    window.clearTimeout(refreshTimer);
    ctx.revert();
  };
}

