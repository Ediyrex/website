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
    const headerEyebrow = container.querySelector("[data-comp-eyebrow]");
    const headerTitle = container.querySelector("[data-comp-title]");
    const headerCopy = container.querySelector("[data-comp-subtitle]");

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true,
      },
    });

    if (headerEyebrow) {
      headerTl.from(headerEyebrow, {
        opacity: 0,
        y: 12,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    if (headerTitle) {
      headerTl.from(
        headerTitle,
        {
          opacity: 0,
          y: 26,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
        },
        "-=0.22"
      );
    }

    if (headerCopy) {
      headerTl.from(
        headerCopy,
        {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "transform",
        },
        "-=0.5"
      );
    }

    // Layer 02: Fragmented -> Paths -> Arrow -> Integrated Architecture
    const transformTrigger =
      container.querySelector("[data-comp-transform-stage]") ?? container;
    const vendorCards = container.querySelectorAll("[data-comp-vendor-card]");
    const connectorArrow = container.querySelector("[data-comp-connector-arrow]");
    const svgPaths = container.querySelectorAll("[data-comp-path]");
    const integratedPlate = container.querySelector("[data-comp-brand-plate]");
    const integratedPillars = container.querySelectorAll("[data-comp-pillar]");
    const integratedSlab = container.querySelector("[data-comp-glass-slab]");

    svgPaths.forEach((node) => {
      const path = node as SVGPathElement;
      if (typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
        opacity: 0.9,
      });
    });

    const stageTl = gsap.timeline({
      scrollTrigger: {
        trigger: transformTrigger,
        start: "top 76%",
        once: true,
      },
    });

    if (vendorCards.length > 0) {
      stageTl.from(vendorCards, {
        opacity: 0,
        x: -16,
        y: 14,
        duration: 0.68,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      });
    }

    if (svgPaths.length > 0) {
      stageTl.to(
        svgPaths,
        {
          strokeDashoffset: 0,
          duration: 1.15,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        "-=0.3"
      );
    }

    if (connectorArrow) {
      stageTl.from(
        connectorArrow,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "back.out(1.6)",
          clearProps: "transform",
        },
        "-=0.85"
      );
    }

    if (integratedSlab) {
      stageTl.from(
        integratedSlab,
        {
          opacity: 0,
          y: 24,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform",
        },
        "-=0.75"
      );
    }

    if (integratedPillars.length > 0) {
      stageTl.from(
        integratedPillars,
        {
          opacity: 0,
          y: 18,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform",
        },
        "-=0.55"
      );
    }

    if (integratedPlate) {
      stageTl.from(
        integratedPlate,
        {
          opacity: 0,
          y: 26,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform",
        },
        "-=0.6"
      );
    }

    // Layer 03 & 04: Five Dimensions + Closing Footer
    const dimensionGrid = container.querySelector("[data-comp-dimensions-grid]");
    const dimensionCards = container.querySelectorAll("[data-comp-dimension-card]");
    const closingFooter = container.querySelector("[data-comp-footer]");

    if (dimensionGrid && dimensionCards.length > 0) {
      gsap.from(dimensionCards, {
        opacity: 0,
        y: 22,
        duration: 0.65,
        stagger: 0.11,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: dimensionGrid,
          start: "top 82%",
          once: true,
        },
      });
    }

    if (closingFooter) {
      gsap.from(closingFooter, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: closingFooter,
          start: "top 90%",
          once: true,
        },
      });
    }
  }, container);

  return () => ctx.revert();
}
