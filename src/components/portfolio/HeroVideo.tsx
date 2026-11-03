"use client";

import { useEffect, useRef } from "react";

/** Decode video only while the opening is visible and motion is allowed. */
export function HeroVideo() {
  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = player.current!;
    const scene = video.closest(".hero-art")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const bounds = scene.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < innerHeight;
    const sync = () => {
      if (motion.matches || !visible || document.hidden) {
        video.pause();
        if (motion.matches) delete video.dataset.ready;
        return;
      }
      if (!video.getAttribute("src"))
        video.src = matchMedia("(max-width: 900px)").matches
          ? "/intro-art/hijaz/mecca-ascii-motion-v3-mobile.mp4"
          : "/intro-art/hijaz/mecca-ascii-motion-v3.mp4";
      video.muted = true;
      void video.play().catch(() => delete video.dataset.ready);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(scene);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={player}
      className="hero-video"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={(event) => {
        event.currentTarget.dataset.ready = "true";
      }}
      onError={(event) => {
        delete event.currentTarget.dataset.ready;
      }}
    />
  );
}
