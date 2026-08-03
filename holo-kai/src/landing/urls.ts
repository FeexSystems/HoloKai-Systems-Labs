/**
 * Civilization Core destinations. In the merged app the Core is same-origin, so
 * VITE_CORE_URL is only needed when the Core is deployed separately.
 */
export const CORE_URL = import.meta.env.VITE_CORE_URL?.trim() || "";

export const coreUrl = (path = "/core") =>
  `${CORE_URL.replace(/\/$/, "")}${path}`;

export const goToCore = (path = "/core") => {
  window.location.href = coreUrl(path);
};

export const SPLINE_LAB_PATH = "/lab-spline";
