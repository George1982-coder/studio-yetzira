"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./AccessibilityMenu.module.css";
import {
  applyA11ySettings,
  clampFontScale,
  DEFAULT_A11Y_SETTINGS,
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
  readA11ySettings,
  saveA11ySettings,
  type A11ySettings,
} from "@/lib/a11y";

function AccessibilityIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="4.5" r="2.25" fill="currentColor" />
      <path
        fill="currentColor"
        d="M4.5 9.25h15a1.25 1.25 0 0 1 0 2.5h-5.1l.85 8.05a1.35 1.35 0 1 1-2.68.28L11.7 14.5h-.4l-.87 5.58a1.35 1.35 0 1 1-2.68-.28L8.6 11.75H4.5a1.25 1.25 0 0 1 0-2.5Z"
      />
    </svg>
  );
}

export function AccessibilityMenu() {
  const panelId = useId();
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_A11Y_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readA11ySettings();
    setSettings(initial);
    applyA11ySettings(initial);
    setReady(true);
  }, []);

  const updateSettings = useCallback((next: A11ySettings) => {
    setSettings(next);
    applyA11ySettings(next);
    saveA11ySettings(next);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const closeBtn = panelRef.current?.querySelector<HTMLElement>('[data-a11y-close="true"]');
    closeBtn?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const bumpFont = (delta: number) => {
    updateSettings({
      ...settings,
      fontScale: clampFontScale(settings.fontScale + delta),
    });
  };

  const toggle = (key: keyof Omit<A11ySettings, "fontScale">) => {
    updateSettings({ ...settings, [key]: !settings[key] });
  };

  const resetAll = () => {
    updateSettings({ ...DEFAULT_A11Y_SETTINGS });
  };

  const scalePercent = Math.round(settings.fontScale * 100);

  return (
    <>
      {open ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="סגירת תפריט נגישות"
          onClick={close}
        />
      ) : null}

      <div className={styles.root} ref={rootRef} data-a11y-widget="true">
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          aria-label={open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
          onClick={() => setOpen((value) => !value)}
        >
          <AccessibilityIcon />
        </button>

        {open ? (
          <div
            ref={panelRef}
            id={panelId}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                תפריט נגישות
              </h2>
              <button
                type="button"
                className={styles.close}
                data-a11y-close="true"
                aria-label="סגירה"
                onClick={close}
              >
                ×
              </button>
            </div>

            <section className={styles.section} aria-label="גודל טקסט">
              <span className={styles.sectionLabel}>גודל טקסט</span>
              <div className={styles.row}>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => bumpFont(-FONT_SCALE_STEP)}
                  disabled={!ready || settings.fontScale <= FONT_SCALE_MIN}
                  aria-label="הקטנת טקסט"
                >
                  א−
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => updateSettings({ ...settings, fontScale: 1 })}
                  disabled={!ready || settings.fontScale === 1}
                  aria-label="איפוס גודל טקסט"
                >
                  איפוס
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => bumpFont(FONT_SCALE_STEP)}
                  disabled={!ready || settings.fontScale >= FONT_SCALE_MAX}
                  aria-label="הגדלת טקסט"
                >
                  א+
                </button>
              </div>
              <p className={styles.scaleHint} aria-live="polite">
                גודל נוכחי: {scalePercent}%
              </p>
            </section>

            <section className={styles.section} aria-label="ניגודיות וצבעים">
              <span className={styles.sectionLabel}>ניגודיות וצבעים</span>
              <div className={styles.row} style={{ flexDirection: "column" }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.toggle} ${settings.highContrast ? styles.btnActive : ""}`}
                  aria-pressed={settings.highContrast}
                  onClick={() => toggle("highContrast")}
                >
                  <span className={styles.toggleLabel}>ניגודיות גבוהה</span>
                  <span className={styles.switch} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.toggle} ${settings.grayscale ? styles.btnActive : ""}`}
                  aria-pressed={settings.grayscale}
                  onClick={() => toggle("grayscale")}
                >
                  <span className={styles.toggleLabel}>גווני אפור (שחור־לבן)</span>
                  <span className={styles.switch} aria-hidden="true" />
                </button>
              </div>
            </section>

            <section className={styles.section} aria-label="תנועה ותוכן">
              <span className={styles.sectionLabel}>תנועה ותוכן</span>
              <div className={styles.row} style={{ flexDirection: "column" }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.toggle} ${settings.reduceMotion ? styles.btnActive : ""}`}
                  aria-pressed={settings.reduceMotion}
                  onClick={() => toggle("reduceMotion")}
                >
                  <span className={styles.toggleLabel}>הפחתת אנימציות</span>
                  <span className={styles.switch} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.toggle} ${settings.highlightLinks ? styles.btnActive : ""}`}
                  aria-pressed={settings.highlightLinks}
                  onClick={() => toggle("highlightLinks")}
                >
                  <span className={styles.toggleLabel}>הדגשת קישורים</span>
                  <span className={styles.switch} aria-hidden="true" />
                </button>
              </div>
            </section>

            <button type="button" className={styles.reset} onClick={resetAll}>
              איפוס כל הגדרות הנגישות
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
