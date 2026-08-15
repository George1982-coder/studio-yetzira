export const A11Y_STORAGE_KEY = "a11y-settings";

export type A11ySettings = {
  fontScale: number;
  highContrast: boolean;
  grayscale: boolean;
  reduceMotion: boolean;
  highlightLinks: boolean;
};

export const DEFAULT_A11Y_SETTINGS: A11ySettings = {
  fontScale: 1,
  highContrast: false,
  grayscale: false,
  reduceMotion: false,
  highlightLinks: false,
};

export const FONT_SCALE_MIN = 0.85;
export const FONT_SCALE_MAX = 1.45;
export const FONT_SCALE_STEP = 0.15;

export function clampFontScale(value: number): number {
  const stepped = Math.round(value / FONT_SCALE_STEP) * FONT_SCALE_STEP;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Number(stepped.toFixed(2))));
}

export function readA11ySettings(): A11ySettings {
  if (typeof window === "undefined") return { ...DEFAULT_A11Y_SETTINGS };
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_A11Y_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<A11ySettings>;
    return {
      fontScale: clampFontScale(
        typeof parsed.fontScale === "number" ? parsed.fontScale : DEFAULT_A11Y_SETTINGS.fontScale
      ),
      highContrast: Boolean(parsed.highContrast),
      grayscale: Boolean(parsed.grayscale),
      reduceMotion: Boolean(parsed.reduceMotion),
      highlightLinks: Boolean(parsed.highlightLinks),
    };
  } catch {
    return { ...DEFAULT_A11Y_SETTINGS };
  }
}

export function saveA11ySettings(settings: A11ySettings): void {
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore quota / private-mode failures
  }
}

export function applyA11ySettings(settings: A11ySettings): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.classList.toggle("a11y-high-contrast", settings.highContrast);
  root.classList.toggle("a11y-grayscale", settings.grayscale);
  root.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
  root.classList.toggle("a11y-highlight-links", settings.highlightLinks);

  if (settings.fontScale === 1) {
    root.style.removeProperty("zoom");
    root.style.removeProperty("font-size");
    root.removeAttribute("data-a11y-font-scale");
  } else {
    const pct = `${Math.round(settings.fontScale * 100)}%`;
    root.style.zoom = String(settings.fontScale);
    root.style.fontSize = pct;
    root.setAttribute("data-a11y-font-scale", String(settings.fontScale));
  }
}

/** Inline bootstrap — runs before paint to avoid a flash of default styles. */
export const A11Y_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(A11Y_STORAGE_KEY)};var s=JSON.parse(localStorage.getItem(k)||"{}");var h=document.documentElement;if(s.highContrast)h.classList.add("a11y-high-contrast");if(s.grayscale)h.classList.add("a11y-grayscale");if(s.reduceMotion)h.classList.add("a11y-reduce-motion");if(s.highlightLinks)h.classList.add("a11y-highlight-links");var f=typeof s.fontScale==="number"?s.fontScale:1;if(f&&f!==1){h.style.zoom=String(f);h.style.fontSize=Math.round(f*100)+"%";h.setAttribute("data-a11y-font-scale",String(f));}}catch(e){}})();`;
