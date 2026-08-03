import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const LOGO_PATHS = {
  horizontal: "/logos/holokai-logo-horizontal.png",
  vertical: "/logos/holokai-logo-vertical.png",
  icon: "/logos/holokai-logo-vertical.png",
  threeD: "/logos/holokai-logo-3d.jpg",
} as const;

export type HoloKaiLogoVariant = keyof typeof LOGO_PATHS;

type HoloKaiLogoProps = {
  variant?: HoloKaiLogoVariant;
  className?: string;
  alt?: string;
};

/**
 * HoloKai branded logo component — renders crisp image assets with responsive containment
 * and an elegant inline fallback badge if asset loading fails.
 */
export function HoloKaiLogo({
  variant = "horizontal",
  className,
  alt = "HoloKai",
}: HoloKaiLogoProps) {
  const [imgError, setImgError] = useState(false);

  const logoSrc = LOGO_PATHS[variant] || LOGO_PATHS.horizontal;

  if (imgError) {
    return (
      <div className={cn("inline-flex items-center gap-2 select-none font-display shrink-0", className)}>
        <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-amber-500/20 border border-amber-500/50 text-amber-400 font-bold text-[10px] tracking-widest shadow-[0_0_8px_rgba(245,158,11,0.3)] shrink-0">
          HK
        </span>
        {variant !== "icon" && (
          <span className="text-sm font-bold tracking-widest text-white uppercase whitespace-nowrap">
            Holo<span className="text-amber-400">Kai</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      onError={() => setImgError(true)}
      className={cn("select-none object-contain shrink-0 max-h-full max-w-full inline-block", className)}
      decoding="async"
      loading="eager"
    />
  );
}



