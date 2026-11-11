import React from "react";
import Image from "next/image";

export function RockPlatform() {
  return (
    <div
      data-arch-rock-platform
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 w-[104%] max-w-[920px] aspect-[1024/341] z-[1]"
    >
      {/* Grounding Ambient Shadow & Orange Glow Beneath Launch */}
      <div
        className="absolute inset-x-[6%] bottom-1 h-8 rounded-full blur-xl opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(17,17,17,0.55) 0%, rgba(17,17,17,0) 72%)",
        }}
      />
      <div
        className="absolute right-[12%] top-[24%] w-[32%] h-14 rounded-full blur-2xl opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(255,105,0,0.75) 0%, rgba(255,105,0,0) 70%)",
        }}
      />
      <Image
        src="/images/architecture/rock-platform.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-contain object-bottom"
      />
    </div>
  );
}
