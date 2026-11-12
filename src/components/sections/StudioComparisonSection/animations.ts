import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function initStudioComparisonAnimations(container: HTMLElement | null) {
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
    const labelEl = container.querySelector("[data-sc-label]");
    const headlineLines = container.querySelectorAll("[data-sc-headline-line]");
    const subtextEl = container.querySelector("[data-sc-subtext]");
    const accentRuleEl = container.querySelector("[data-sc-accent-rule]");
    const leftPanel = container.querySelector("[data-sc-left-panel]");
    const rightPanel = container.querySelector("[data-sc-right-panel]");
    const vendorCards = container.querySelectorAll("[data-sc-vendor-card]");
    const transitionArrow = container.querySelector("[data-sc-transition-arrow]");
    const capabilityCards = container.querySelectorAll("[data-sc-capability-card]");
    const advantageCards = container.querySelectorAll("[data-sc-advantage-card]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 86%",
        once: true,
      },
    });

    if (labelEl) {
      tl.from(labelEl, {
        opacity: 0,
        y: 12,
        duration: 0.45,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });
    }

    if (headlineLines.length > 0) {
      tl.from(
        headlineLines,
        {
          opacity: 0,
          y: 22,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.25"
      );
    }

    if (subtextEl) {
      tl.from(
        subtextEl,
        {
          opacity: 0,
          y: 16,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.45"
      );
    }

    if (accentRuleEl) {
      tl.from(
        accentRuleEl,
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.45,
          ease: "power3.out",
          clearProps: "transform",
        },
        "-=0.35"
      );
    }

    if (leftPanel) {
      tl.from(
        leftPanel,
        {
          opacity: 0,
          x: -24,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.35"
      );
    }

    if (rightPanel) {
      tl.from(
        rightPanel,
        {
          opacity: 0,
          x: 24,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "<"
      );
    }

    if (vendorCards.length > 0) {
      tl.from(
        vendorCards,
        {
          opacity: 0,
          y: 12,
          duration: 0.35,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.45"
      );
    }

    if (transitionArrow) {
      tl.from(
        transitionArrow,
        {
          opacity: 0,
          scale: 0.78,
          duration: 0.45,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.35"
      );
    }

    if (capabilityCards.length > 0) {
      tl.from(
        capabilityCards,
        {
          opacity: 0,
          y: 14,
          duration: 0.45,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.35"
      );
    }

    if (advantageCards.length > 0) {
      tl.from(
        advantageCards,
        {
          opacity: 0,
          y: 18,
          duration: 0.5,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        "-=0.2"
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

