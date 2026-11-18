import React from "react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="min-h-[70vh] bg-[#08090B] flex flex-col items-center justify-center px-5 py-32 space-y-4"
    >
      <div className="w-8 h-8 rounded-full border-2 border-[#252A32] border-t-[#D6B77A] animate-spin" />
      <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#777D87]">
        Loading Ediyrex Studio
      </span>
    </div>
  );
}

