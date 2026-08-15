/** Environment-aware destinations for the HoloKai Civilization Core app. */
export const CORE_URL =
  import.meta.env.VITE_CORE_URL?.trim() || "http://localhost:5000";

export const coreUrl = (path = "") =>
  `${CORE_URL.replace(/\/$/, "")}${path}`;

export const goToCore = (path = "") => {
  window.location.href = coreUrl(path);
};

/** Spline Lab lives inside this app. */
export const SPLINE_LAB_PATH = "/lab-spline";
