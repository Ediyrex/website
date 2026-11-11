import { gsap, ScrollTrigger } from "@/lib/gsap";

export function initWhyEdiyrexAnimations(rootEl: HTMLElement): () => void {
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
    // 1. Left Manifesto Reveal
    const label = rootEl.querySelector("[data-we-label]");
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

    const lines = rootEl.querySelectorAll("[data-we-manifesto-line]");
    if (lines.length > 0) {
      gsap.from(lines, {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: lines[0],
          start: "top 86%",
          once: true,
        },
      });
    }

    const copyBlocks = rootEl.querySelectorAll("[data-we-manifesto-copy]");
    if (copyBlocks.length > 0) {
      gsap.from(copyBlocks, {
        opacity: 0,
        y: 16,
        duration: 0.75,
        stagger: 0.12,
        delay: 0.2,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: copyBlocks[0],
          start: "top 88%",
          once: true,
        },
      });
    }

    // 2. Interactive Studio Flywheel
    const flywheel = rootEl.querySelector("[data-we-flywheel]");
    if (flywheel) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: flywheel,
          start: "top 84%",
          once: true,
        },
      });

      const loopTrace = flywheel.querySelector<SVGGeometryElement>(
        "[data-we-loop-draw]"
      );
      if (loopTrace) {
        const total =
          typeof loopTrace.getTotalLength === "function"
            ? loopTrace.getTotalLength()
            : 1600;
        gsap.set(loopTrace, {
          strokeDasharray: total,
          strokeDashoffset: total,
        });
        tl.to(
          loopTrace,
          { strokeDashoffset: 0, duration: 1.35, ease: "power3.out" },
          0
        );
      }

      const loopGlass = flywheel.querySelector("[data-we-loop-base]");
      const loopHighlight = flywheel.querySelector("[data-we-loop-highlight]");
      if (loopGlass || loopHighlight) {
        tl.from(
          [loopGlass, loopHighlight].filter(Boolean),
          {
            opacity: 0,
            scale: 0.96,
            transformOrigin: "center center",
            duration: 1.15,
            ease: "power3.out",
            clearProps: "opacity,scale",
          },
          0.08
        );
      }

      const core = flywheel.querySelector("[data-we-flywheel-core]");
      if (core) {
        tl.from(
          core,
          {
            opacity: 0,
            scale: 0.88,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity,scale",
          },
          0.25
        );
      }

      const nodes = flywheel.querySelectorAll("[data-we-flywheel-node]");
      if (nodes.length > 0) {
        tl.from(
          nodes,
          {
            opacity: 0,
            y: 18,
            stagger: 0.14,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,y",
            onComplete: () => {
              // Subtle gentle depth float (4-6s)
              nodes.forEach((node, idx) => {
                gsap.to(node, {
                  y: idx % 2 === 0 ? -5 : 5,
                  duration: idx % 2 === 0 ? 4.8 : 5.6,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              });
            },
          },
          0.32
        );
      }

      const arcArrows = flywheel.querySelectorAll("[data-we-arc-arrow]");
      if (arcArrows.length > 0) {
        tl.from(
          arcArrows,
          {
            opacity: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "opacity",
          },
          0.5
        );
      }

      // Travelling highlight along infinity loop (10s cycle)
      const loopPulse = flywheel.querySelector<SVGGeometryElement>(
        "[data-we-loop-pulse]"
      );
      if (loopPulse) {
        gsap.to(loopPulse, {
          strokeDashoffset: -1735,
          duration: 10,
          repeat: -1,
          ease: "none",
        });
      }
    }

    // 3. Operating Principles Sequential Reveal
    const principles = rootEl.querySelectorAll("[data-we-principle]");
    if (principles.length > 0) {
      gsap.from(principles, {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: principles[0],
          start: "top 86%",
          once: true,
        },
      });
    }

    // 4. In-House Product Cards Stagger
    const products = rootEl.querySelectorAll("[data-we-product-card]");
    if (products.length > 0) {
      gsap.from(products, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: products[0],
          start: "top 86%",
          once: true,
        },
      });
    }
  }, rootEl);

  return () => ctx.revert();
}

