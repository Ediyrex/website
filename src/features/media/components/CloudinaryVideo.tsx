"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { getVideoPosterUrl } from "@/lib/server/cloudinary";

export interface CloudinaryVideoProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  aspectRatio?: "16/9" | "9/16" | "4/3" | "1/1";
  className?: string;
}

export function CloudinaryVideo({
  src,
  poster,
  title,
  autoPlay = false,
  loop = true,
  muted = true,
  controls = true,
  aspectRatio = "16/9",
  className = "",
}: CloudinaryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showOverlay, setShowOverlay] = useState(!autoPlay);

  const defaultPoster = poster || getVideoPosterUrl(src);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowOverlay(false);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowOverlay(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div
      className={`relative group rounded-xl overflow-hidden bg-[#08090B] border border-[#252A32] ${className}`}
      style={{ aspectRatio }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={defaultPoster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => {
          setIsPlaying(true);
          setShowOverlay(false);
        }}
        onPause={() => {
          setIsPlaying(false);
          setShowOverlay(true);
        }}
      />

      {/* Center Play Button Overlay */}
      {showOverlay && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center cursor-pointer transition-opacity"
        >
          <button
            type="button"
            className="w-16 h-16 rounded-full bg-[#D6B77A] text-[#08090B] flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-[#E5CCA0] transition-transform cursor-pointer"
            aria-label="Play video"
          >
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </button>
        </div>
      )}

      {/* Bottom Controls Bar */}
      {controls && (
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg text-[#F5F3EE] hover:text-[#D6B77A] transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-[#F5F3EE] hover:text-[#D6B77A] transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {title && (
              <span className="text-xs font-mono text-[#F5F3EE] truncate max-w-xs pl-2">
                {title}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-[#F5F3EE] hover:text-[#D6B77A] transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
