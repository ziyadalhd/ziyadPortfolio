import Image from "next/image";

import type { Dictionary } from "@/i18n/types";
import { HeroVideo } from "./HeroVideo";

export function HeroArt({ content }: { content: Dictionary["spec"]["hero"] }) {
  return (
    <figure className="hero-art">
      <Image
        src="/intro-art/hijaz/mecca-motion-poster-v3.webp"
        alt={content.sceneDescription}
        width={3962}
        height={1588}
        sizes="100vw"
        preload
        unoptimized
      />
      <HeroVideo />
    </figure>
  );
}
