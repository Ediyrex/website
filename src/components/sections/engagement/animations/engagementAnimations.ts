import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function initEngagementAnimations(container: HTMLElement | null) {
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
    const headerItems = container.querySelectorAll("[data-engagement-header]");
    const stageItems = container.querySelectorAll("[data-engagement-stage]");
    const ribbonPaths = container.querySelectorAll("[data-engagement-ribbon-path]");

    if (headerItems.length > 0) {
      gsap.from(headerItems, {
        y: 22,
        opacity: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
      });
    }

    if (stageItems.length > 0) {
      gsap.from(stageItems, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: container,
          start: "top 72%",
          once: true,
        },
      });
    }

    ribbonPaths.forEach((node) => {
      const path = node as SVGPathElement;
      if (typeof path.getTotalLength !== "function") return;
      const totalLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength * 0.25,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.25,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          once: true,
        },
      });
    });
  }, container);

  return () => ctx.revert();
}

