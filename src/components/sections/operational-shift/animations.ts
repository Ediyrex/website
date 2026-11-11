import { gsap, ScrollTrigger } from "@/lib/gsap";

export function initOperationalShiftAnimations(rootEl: HTMLElement): () => void {
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
    const label = rootEl.querySelector("[data-os-label]");
    if (label) {
      gsap.from(label, {
        opacity: 0,
        y: 12,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: label,
          start: "top 88%",
          once: true,
        },
      });
    }

    const headlineLines = rootEl.querySelectorAll("[data-os-headline-line]");
    if (headlineLines.length > 0) {
      gsap.from(headlineLines, {
        opacity: 0,
        y: 24,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: headlineLines[0],
          start: "top 86%",
          once: true,
        },
      });
    }

    const intro = rootEl.querySelector("[data-os-intro]");
    if (intro) {
      gsap.from(intro, {
        opacity: 0,
        x: 16,
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

    // 2. Main Transformation Sequence
    const fragCards = rootEl.querySelectorAll<HTMLElement>("[data-os-frag-card]");
    const fragLines =
      rootEl.querySelectorAll<SVGGeometryElement>("[data-os-frag-line]");
    const transitionNode = rootEl.querySelector("[data-os-transition-node]");
    const core = rootEl.querySelector("[data-os-core]");
    const connectedCards = rootEl.querySelectorAll("[data-os-connected-card]");
    const connectLines = rootEl.querySelectorAll<SVGGeometryElement>(
      "[data-os-connect-line]"
    );

    const visualAnchor =
      fragCards[0] ?? transitionNode ?? core ?? rootEl;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: visualAnchor,
        start: "top 82%",
        once: true,
      },
    });

    if (fragCards.length > 0) {
      tl.from(
        fragCards,
        {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "opacity,y",
          onComplete: () => {
            // Subtle ambient floating only on isolated fragmented cards
            fragCards.forEach((card, idx) => {
              const duration = Number(card.dataset.floatDuration || 4.8);
              const delay = Number(card.dataset.floatDelay || 0);
              const offset = idx % 2 === 0 ? -4 : 4;
              gsap.to(card, {
                y: offset,
                duration,
                delay,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            });
          },
        },
        0
      );
    }

    fragLines.forEach((line, idx) => {
      const len =
        typeof line.getTotalLength === "function" ? line.getTotalLength() : 200;
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(
        line,
        { strokeDashoffset: 0, duration: 1.0, ease: "power2.out" },
        0.22 + idx * 0.05
      );
    });

    if (transitionNode) {
      tl.from(
        transitionNode,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.65,
          ease: "back.out(1.4)",
          clearProps: "transform,opacity,scale",
        },
        0.45
      );
    }

    if (core) {
      tl.from(
        core,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform,opacity,scale",
        },
        0.55
      );
    }

    if (connectedCards.length > 0) {
      tl.from(
        connectedCards,
        {
          opacity: 0,
          y: 18,
          stagger: 0.09,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
        0.65
      );
    }

    connectLines.forEach((line, idx) => {
      const len =
        typeof line.getTotalLength === "function" ? line.getTotalLength() : 320;
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(
        line,
        { strokeDashoffset: 0, duration: 1.1, ease: "power3.out" },
        0.6 + idx * 0.05
      );
    });

    // 3. Restrained Scroll Parallax Between Clusters & Terrain
    const leftTerrain = rootEl.querySelector("[data-os-terrain-left]");
    const rightTerrain = rootEl.querySelector("[data-os-terrain-right]");
    if (leftTerrain) {
      gsap.to(leftTerrain, {
        y: -14,
        ease: "none",
        scrollTrigger: {
          trigger: rootEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
    if (rightTerrain) {
      gsap.to(rightTerrain, {
        y: 14,
        ease: "none",
        scrollTrigger: {
          trigger: rootEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // 4. Benefits Strip Entrance
    const benefits = rootEl.querySelector("[data-os-benefits]");
    if (benefits) {
      gsap.from(benefits.children, {
        opacity: 0,
        y: 16,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: benefits,
          start: "top 90%",
          once: true,
        },
      });
    }
  }, rootEl);

  return () => ctx.revert();
}

