"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";

const GOLD = "oklch(0.78 0.17 70)";
const BG = "oklch(0.16 0.015 260)";
const BG_2 = "oklch(0.20 0.015 260)";
const TEXT = "oklch(0.96 0.01 260)";
const TEXT_MUTED = "oklch(0.72 0.02 260)";
const TEXT_DIM = "oklch(0.62 0.02 260)";
const BORDER = "oklch(0.3 0.02 260)";
const BORDER_DIM = "oklch(0.28 0.015 260)";

const PROJECTS = [
  { num: "01", title: "נגריית האינטרנט", subtitle: "אתר לעסק נגרות — ברור, מהיר, עם קריאה לפעולה", url: "https://shlomi-nagaria.vercel.app/", image: "/projects/proj-01.jpg" },
  { num: "02", title: "Carpro CRM", subtitle: "מערכת לניהול לקוחות ורכב — בנויה לפי הצרכים של העסק", url: "https://cars-geo.com/", image: "/projects/proj-02.jpg" },
  { num: "03", title: "אינסטלציה מקצועית", subtitle: "דף נחיתה שמכוון לשיחת טלפון, לא לגלילה סתם", url: "https://installer-psi.vercel.app/", image: "/projects/proj-03.jpg" },
];

const STEPS = [
  { letter: "א׳", title: "שיחה קצרה", desc: "מבינים מה העסק עושה, מי צריך להגיע לאתר, ומה אמור לקרות אחרי הכניסה — פנייה, שיחה או הזמנה." },
  { letter: "ב׳", title: "מבנה ותוכן", desc: "בונים את הסדר של הדף לפני הקוד: מה רואים קודם, מה אומרים, ואיפה הכפתור שסוגר." },
  { letter: "ג׳", title: "בנייה", desc: "מעלים אתר שעובד במובייל, נטען מהר, ונראה כמו העסק שלכם — לא כמו תבנית מוכנה." },
  { letter: "ד׳", title: "השקה וליווי", desc: "מעלים לאוויר, בודקים שהכול עובד, ונותנים הוראות פשוטות לתפעול. לא נעלמים אחרי המסירה." },
];

const MARQUEE_ITEMS = Array(6).fill(["דף שמביא פניות", "אתר לעסק מקומי", "בלי תבניות", "מענה תוך יום", "מובייל קודם", "מסירה מלאה"]).flat();

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -14, y: px * 14 });
  };
  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        display: "block",
        padding: 36,
        borderRadius: 18,
        background: BG_2,
        border: `1px solid ${BORDER}`,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x || tilt.y ? 1.02 : 1})`,
        transition: "transform 0.15s ease-out",
        cursor: "pointer",
      }}
    >
      <div style={{ width: "100%", height: 180, borderRadius: 12, overflow: "hidden", marginBottom: 24, position: "relative", background: "oklch(0.24 0.015 260)" }}>
        {/* Replace with a real screenshot of the project at /public/projects/... */}
        <Image src={project.image} alt={project.title} fill style={{ objectFit: "cover" }} />
      </div>
      <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 15, color: GOLD, marginBottom: 18 }}>{project.num}</div>
      <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 800, fontSize: 26, color: TEXT, marginBottom: 10, letterSpacing: "-0.5px" }}>{project.title}</div>
      <div style={{ fontSize: 15, color: TEXT_DIM, fontWeight: 600 }}>{project.subtitle}</div>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: GOLD }}
      >
        לפתיחת האתר ↗
      </a>
    </div>
  );
}

export default function Home() {
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadMsg, setLeadMsg] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [leadError, setLeadError] = useState("");

  const marqueeLoop = useMemo(() => [...MARQUEE_ITEMS, ...MARQUEE_ITEMS], []);

  const onLeadSubmit = async () => {
    setLeadError("");
    setLeadStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadContact.trim(),
          message: leadMsg.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // If WhatsApp API isn't configured yet, fall back to opening a chat with you
        if (data.code === "NOT_CONFIGURED") {
          const name = leadName.trim() || "אורח";
          const msg = leadMsg.trim() ? ` הנה כמה מילים על הפרויקט שלי: ${leadMsg.trim()}` : "";
          const text = `היי גאורגי, שמי ${name}. ראיתי את האתר ואשמח לבדוק איתך בניית אתר לעסק.${msg} אפשר לחזור אליי ל-${leadContact.trim() || ""}.`;
          window.open(`https://wa.me/972524186300?text=${encodeURIComponent(text)}`, "_blank");
          setLeadStatus("idle");
          return;
        }
        setLeadError(data.error || "משהו לא עבד. נסו שוב, או כתבו בוואטסאפ.");
        setLeadStatus("error");
        return;
      }
      setLeadStatus("success");
      setLeadName("");
      setLeadContact("");
      setLeadMsg("");
    } catch {
      setLeadError("יש תקלה זמנית. נסו שוב בעוד רגע, או שלחו הודעה בוואטסאפ.");
      setLeadStatus("error");
    }
  };

  return (
    <div dir="rtl" style={{ background: BG, color: TEXT, fontFamily: 'var(--font-assistant), Assistant, sans-serif', minHeight: "100vh", overflowX: "hidden" }}>
      {/* NAV */}
      <nav
        className="nav-bar"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 64px",
          position: "sticky", top: 0, zIndex: 50, background: "oklch(0.16 0.015 260 / 0.85)", backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🇮🇱</span> גאורגי מצאידזה
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 36, fontSize: 16, fontWeight: 600, color: "oklch(0.85 0.01 260)" }}>
          <a href="#work" style={{ color: "inherit" }}>עבודות</a>
          <a href="#process" style={{ color: "inherit" }}>איך עובדים</a>
          <a href="#about" style={{ color: "inherit" }}>עליי</a>
          <a href="#contact" style={{ color: "inherit" }}>השאירו פנייה</a>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero-grid"
        style={{
          position: "relative", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 48, alignItems: "center",
          padding: "64px 64px 96px", maxWidth: 1400, margin: "0 auto", overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: -200, right: -150, width: 600, height: 600, borderRadius: "50%",
            background: `radial-gradient(circle, oklch(0.78 0.17 70 / 0.16) 0%, transparent 70%)`,
            filter: "blur(20px)", animation: "drift 14s ease-in-out infinite", pointerEvents: "none",
          }}
        />
        <div>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px",
              border: `1px solid oklch(0.4 0.02 260)`, borderRadius: 999, fontSize: 14, fontWeight: 600, color: GOLD,
              marginBottom: 28, opacity: 0, animation: "fadeUp 0.7s ease-out 0.05s forwards",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
            פרילנס · אתרים ודפי נחיתה לעסקים מקומיים
          </div>
          <h1 className="hero-title" style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 68, lineHeight: 1.08, margin: "0 0 28px", letterSpacing: "-1.5px" }}>
            <span style={{ display: "block", opacity: 0, animation: "fadeUp 0.7s ease-out 0.15s forwards" }}>בונים אתרים ודפי נחיתה שמוכרים – לא רק יפים.</span>
            <span style={{ display: "block", color: GOLD, opacity: 0, animation: "fadeUp 0.7s ease-out 0.28s forwards" }}>הופכים את הגולשים שלך ללקוחות משלמים.</span>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: TEXT_MUTED, maxWidth: 520, margin: "0 0 40px", opacity: 0, animation: "fadeUp 0.7s ease-out 0.54s forwards" }}>
            אני גאורגי. בונה דפי נחיתה ואתרים קטנים לבעלי מקצוע ועסקים מקומיים — דף ברור שמסביר מה עושים, למי זה מתאים, ואיך ליצור קשר. עובדים ישירות איתי, בלי תבנית מוכנה, עם מענה תוך יום.
          </p>
          <div className="hero-ctas" style={{ display: "flex", gap: 18, marginBottom: 44, flexWrap: "wrap" }}>
            <a href="#contact" style={{ background: GOLD, color: BG, fontWeight: 700, fontSize: 16, padding: "16px 32px", borderRadius: 10, display: "inline-block" }}>דברו איתי על הפרויקט</a>
            <a href="#work" style={{ border: `1px solid oklch(0.4 0.02 260)`, color: TEXT, fontWeight: 700, fontSize: 16, padding: "16px 32px", borderRadius: 10, display: "inline-block" }}>ראו עבודות ↓</a>
          </div>
          <div className="hero-stats" style={{ display: "flex", gap: 40, paddingTop: 32, borderTop: `1px solid ${BORDER_DIM}`, flexWrap: "wrap" }}>
            {[
              { value: "6+", label: "שנים בבנייה ותחזוקה" },
              { value: "1:1", label: "עובדים ישירות איתי" },
              { value: "24ש׳", label: "עד חזרה ראשונה" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 28, color: GOLD }}>{s.value}</div>
                <div style={{ fontSize: 14, color: TEXT_DIM, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-photo-wrap" style={{ position: "relative", display: "flex", justifyContent: "center", perspective: 1200 }}>
          <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, oklch(0.78 0.17 70 / 0.35) 0%, transparent 65%)`, filter: "blur(30px)", animation: "glow 5s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: -24, border: `1px dashed oklch(0.4 0.02 260)`, borderRadius: 24, animation: "spin 40s linear infinite" }} />
          <div
            className="hero-photo"
            style={{
              position: "relative", width: 340, height: 420, borderRadius: 20, overflow: "hidden",
              boxShadow: "0 50px 100px -20px oklch(0 0 0 / 0.7), 0 0 60px -10px oklch(0.78 0.17 70 / 0.3)",
              border: "1px solid oklch(0.4 0.05 70)", transform: "rotateY(-8deg) rotateX(4deg)",
            }}
          >
            <Image src="/georgi.jpeg" alt="גאורגי מצאידזה" fill style={{ objectFit: "cover" }} priority />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, oklch(0.16 0.015 260 / 0.85) 0%, transparent 40%)` }} />
            <div style={{ position: "absolute", bottom: 20, right: 20, left: 20 }}>
              <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 700, fontSize: 20 }}>גאורגי מצאידזה</div>
              <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>אתרים ודפי נחיתה לעסקים</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop: `1px solid ${BORDER_DIM}`, borderBottom: `1px solid ${BORDER_DIM}`, overflow: "hidden", padding: "22px 0", background: BG_2 }}>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 22s linear infinite", gap: 48 }}>
          {marqueeLoop.map((item, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 700, fontSize: 22, color: "oklch(0.4 0.02 260)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 48 }}>
              {item} <span style={{ color: GOLD }}>✳</span>
            </span>
          ))}
        </div>
      </div>

      {/* WORK */}
      <section id="work" className="section-pad" style={{ padding: "120px 64px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 12 }}>עבודות שאפשר לפתוח עכשיו</div>
          <h2 style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 44, margin: 0, letterSpacing: "-1px" }}>לא מצגות — אתרים חיים באוויר</h2>
        </div>
        <div className="work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, perspective: 1400 }}>
          {PROJECTS.map((p) => (
            <ProjectCard key={p.num} project={p} />
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="section-pad" style={{ padding: "100px 64px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 12 }}>מה קורה אחרי שפונים</div>
          <h2 style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 44, margin: 0, letterSpacing: "-1px" }}>ארבעה שלבים, בלי הפתעות באמצע</h2>
        </div>
        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {STEPS.map((step) => (
            <div key={step.letter} style={{ borderTop: `2px solid ${BORDER}`, paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 32, color: "oklch(0.4 0.02 260)", marginBottom: 20 }}>{step.letter}</div>
              <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 800, fontSize: 19, marginBottom: 12 }}>{step.title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: TEXT_DIM }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-grid section-pad" style={{ padding: "100px 64px", maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 64, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", aspectRatio: "3 / 4", borderRadius: 20, overflow: "hidden", border: "1px solid oklch(0.35 0.02 260)", position: "relative" }}>
            <Image src="/georgi.jpeg" alt="גאורגי מצאידזה" fill style={{ objectFit: "cover", filter: "grayscale(0.3)" }} />
          </div>
          <div
            style={{
              position: "absolute", bottom: -20, left: -20, background: GOLD, color: BG, fontFamily: 'var(--font-heebo), Heebo, sans-serif',
              fontWeight: 900, fontSize: 16, padding: "16px 22px", borderRadius: 14, boxShadow: "0 20px 40px -10px oklch(0 0 0 / 0.5)",
            }}
          >
            נעשה ביחד
          </div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 12 }}>למה לעבוד איתי</div>
          <h2 style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 38, margin: "0 0 28px", letterSpacing: "-1px" }}>גאורגי מצאידזה</h2>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: TEXT_MUTED, margin: "0 0 20px" }}>
            אני לא סוכנות ולא חבילת תבניות. אתם מדברים איתי ישירות — מהשיחה הראשונה עד שהאתר עולה.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: TEXT_MUTED, margin: 0 }}>
            רוב הלקוחות שלי הם עסקים קטנים ובעלי מקצוע שצריכים דף אחד טוב: מה מציעים, למי זה מתאים, ואיך משאירים פנייה. אני בונה את זה לפי העסק שלכם, לא לפי טרנד עיצובי. אחרי ההשקה אתם יודעים איך לעדכן ומה לעשות אם משהו נתקע.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-pad" style={{ padding: "140px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, oklch(0.78 0.17 70 / 0.12) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <h2 className="contact-title" style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 900, fontSize: 52, margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.15 }}>
            רוצים אתר שמביא פניות? שלחו הודעה.
          </h2>
          <p style={{ fontSize: 16, color: TEXT_DIM, margin: "0 0 44px" }}>חוזר תוך 24 שעות · בלי התחייבות · אפשר גם בוואטסאפ ישירות</p>

          <div style={{ background: BG_2, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 36, textAlign: "right", maxWidth: 500, margin: "0 auto 44px" }}>
            {leadStatus === "success" ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontFamily: 'var(--font-heebo), Heebo, sans-serif', fontWeight: 800, fontSize: 22, marginBottom: 10 }}>קיבלתי — תודה</div>
                <p style={{ fontSize: 15, color: TEXT_MUTED, margin: "0 0 24px", lineHeight: 1.6 }}>
                  נשלח אליכם אישור בוואטסאפ. אחזור עם שאלות קצרות או הצעה תוך יום.
                </p>
                <button
                  onClick={() => setLeadStatus("idle")}
                  style={{ background: "transparent", color: GOLD, fontWeight: 700, fontSize: 15, padding: "10px 18px", borderRadius: 10, border: `1px solid ${BORDER}`, cursor: "pointer", fontFamily: 'var(--font-assistant), Assistant, sans-serif' }}
                >
                  שליחה נוספת
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input
                  type="text" placeholder="איך קוראים לכם" value={leadName} onChange={(e) => setLeadName(e.target.value)}
                  style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px", color: TEXT, fontFamily: 'var(--font-assistant), Assistant, sans-serif', fontSize: 15 }}
                />
                <input
                  type="tel" placeholder="וואטסאפ לחזרה (למשל 052-0000000)" value={leadContact} onChange={(e) => setLeadContact(e.target.value)}
                  style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px", color: TEXT, fontFamily: 'var(--font-assistant), Assistant, sans-serif', fontSize: 15 }}
                />
                <textarea
                  placeholder="במשפט-שניים: מה העסק ומה צריך מהאתר" value={leadMsg} onChange={(e) => setLeadMsg(e.target.value)} rows={3}
                  style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px", color: TEXT, fontFamily: 'var(--font-assistant), Assistant, sans-serif', fontSize: 15, resize: "none" }}
                />
                {leadError ? (
                  <div style={{ color: "oklch(0.75 0.12 25)", fontSize: 14, fontWeight: 600 }}>{leadError}</div>
                ) : null}
                <button
                  onClick={onLeadSubmit}
                  disabled={leadStatus === "loading"}
                  style={{
                    background: GOLD, color: BG, fontWeight: 800, fontSize: 16, padding: 16, borderRadius: 10,
                    border: "none", cursor: leadStatus === "loading" ? "wait" : "pointer",
                    fontFamily: 'var(--font-assistant), Assistant, sans-serif', opacity: leadStatus === "loading" ? 0.7 : 1,
                  }}
                >
                  {leadStatus === "loading" ? "שולח..." : "שליחה — חוזר אליכם בוואטסאפ"}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 28, fontSize: 16, fontWeight: 600, color: TEXT_MUTED }}>
            <a href="https://wa.me/972524186300" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>052-4186300 · WhatsApp</a>
            <a href="https://www.facebook.com/profile.php?id=100077935897749" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>Facebook</a>
          </div>
        </div>
      </section>

      <footer className="site-footer" style={{ padding: "36px 64px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${BORDER_DIM}`, fontSize: 14, color: "oklch(0.5 0.02 260)" }}>
        <div>© 2026 גאורגי מצאידזה</div>
        <div>אתרים ודפי נחיתה · ישראל</div>
      </footer>
    </div>
  );
}
