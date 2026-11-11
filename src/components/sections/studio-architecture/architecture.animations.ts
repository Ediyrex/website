import { gsap, ScrollTrigger } from "@/lib/gsap";

export function initArchitectureAnimations(rootEl: HTMLElement): () => void {
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
    // 1. Section label
    const label = rootEl.querySelector("[data-arch-label]");
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

    // 2. Main headline lines
    const headlineLines = rootEl.querySelectorAll("[data-arch-headline-line]");
    if (headlineLines.length > 0) {
      gsap.from(headlineLines, {
        opacity: 0,
        y: 28,
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

    // 3. Supporting description
    const introCopy = rootEl.querySelector("[data-arch-intro-copy]");
    if (introCopy) {
      gsap.from(introCopy, {
        opacity: 0,
        y: 18,
        duration: 0.75,
        delay: 0.18,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: introCopy,
          start: "top 88%",
          once: true,
        },
      });
    }

    // 4. Coordinated Workflow Scene Timeline (Mountain -> Discover -> Craft -> Execute -> Launch -> SVG Lines)
    const workflowStage = rootEl.querySelector("[data-arch-workflow]");
    if (workflowStage) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: workflowStage,
          start: "top 82%",
          once: true,
        },
      });

      const mountain = workflowStage.querySelector("[data-arch-rock-platform]");
      if (mountain) {
        tl.from(
          mountain,
          {
            opacity: 0,
            y: 36,
            duration: 1.2,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          0
        );
      }

      const discover = workflowStage.querySelectorAll(
        "[data-arch-card='discover']"
      );
      if (discover.length > 0) {
        tl.from(
          discover,
          {
            opacity: 0,
            y: 26,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          0.15
        );
      }

      const craft = workflowStage.querySelectorAll("[data-arch-card='craft']");
      if (craft.length > 0) {
        tl.from(
          craft,
          {
            opacity: 0,
            x: -28,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          0.28
        );
      }

      const execute = workflowStage.querySelectorAll(
        "[data-arch-card='execute']"
      );
      if (execute.length > 0) {
        tl.from(
          execute,
          {
            opacity: 0,
            x: -28,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          0.42
        );
      }

      const launch = workflowStage.querySelectorAll(
        "[data-arch-card='launch']"
      );
      if (launch.length > 0) {
        tl.from(
          launch,
          {
            opacity: 0,
            scale: 0.94,
            y: 20,
            duration: 1.0,
            ease: "power3.out",
            clearProps: "transform,opacity,scale",
          },
          0.55
        );
      }
    }

    // 5. Hybrid Studio Model panel
    const hybrid = rootEl.querySelector("[data-arch-hybrid]");
    if (hybrid) {
      gsap.from(hybrid, {
        opacity: 0,
        y: 26,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: hybrid,
          start: "top 84%",
          once: true,
        },
      });
    }

    // 6. Division navigation bottom columns
    const divisionCols = rootEl.querySelectorAll("[data-arch-division-col]");
    if (divisionCols.length > 0) {
      gsap.from(divisionCols, {
        opacity: 0,
        y: 22,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: divisionCols[0],
          start: "top 88%",
          once: true,
        },
      });
    }
  }, rootEl);

  return () => ctx.revert();
}
