"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

/**
 * Safely loads textures for R3F components without throwing uncaught loader errors.
 * Tries primaryUrl, falls back to secondaryUrl, and finally to a clean generated CanvasTexture.
 */
export function useSafeTexture(
  primaryUrl?: string,
  secondaryUrl?: string,
  accentColor: string = "#A9D5B0",
  label: string = ""
): THREE.Texture {
  const fallbackTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Holographic gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 768);
      grad.addColorStop(0, "#0c0c10");
      grad.addColorStop(0.5, "#161620");
      grad.addColorStop(1, "#0c0c10");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 768);

      // Accent border & frame
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 480, 736);

      // Tech grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let y = 60; y < 700; y += 40) {
        ctx.beginPath();
        ctx.moveTo(32, y);
        ctx.lineTo(480, y);
        ctx.stroke();
      }

      ctx.fillStyle = accentColor;
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("HOLOKAI VANGUARD", 256, 320);
      if (label) {
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label.toUpperCase(), 256, 360);
      }
      ctx.font = "12px monospace";
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText("HOLOGRAPHIC CHASSIS ACTIVE", 256, 400);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [accentColor, label]);

  const [texture, setTexture] = useState<THREE.Texture>(fallbackTexture);

  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();

    const tryLoad = (url: string, nextUrl?: string) => {
      loader.load(
        url,
        (loadedTex: any) => {
          if (!active) return;
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          loadedTex.anisotropy = 16;
          setTexture(loadedTex);
        },
        undefined,
        () => {
          if (!active) return;
          if (nextUrl && nextUrl !== url) {
            tryLoad(nextUrl);
          } else {
            setTexture(fallbackTexture);
          }
        }
      );
    };

    if (primaryUrl) {
      tryLoad(primaryUrl, secondaryUrl);
    } else if (secondaryUrl) {
      tryLoad(secondaryUrl);
    } else {
      setTexture(fallbackTexture);
    }

    return () => {
      active = false;
    };
  }, [primaryUrl, secondaryUrl, fallbackTexture]);

  return texture;
}
