import React from "react";

interface HoloKaiLogoProps {
  variant?: "horizontal" | "vertical" | "icon" | "3d";
  className?: string;
}

export function HoloKaiLogo({ variant = "horizontal", className = "h-8 w-auto" }: HoloKaiLogoProps) {
  const logoSrc =
    variant === "vertical"
      ? "/logos/holokai-logo-vertical.png"
      : variant === "3d"
      ? "/logos/holokai-logo-3d.jpg"
      : "/logos/holokai-logo-horizontal.png";

  return (
    <img
      src={logoSrc}
      alt="HoloKai Logo"
      className={className}
    />
  );
}
