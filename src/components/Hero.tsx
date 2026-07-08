import Link from "next/link";
import { heroEyebrow, heroSub } from "@/lib/content";

export function Hero() {
  return (
    <section className="hero">
      <div className="print-shape shape-pink" aria-hidden="true" />
      <div className="print-shape shape-blue" aria-hidden="true" />
      <div className="print-shape shape-yellow" aria-hidden="true" />

      <div className="eyebrow">
        <span className="dot" aria-hidden="true" />
        {heroEyebrow}
      </div>

      <h1>
        אתרים שנשארים <span className="accent">בזיכרון,</span>
        <br />
        לא רק <span className="stamp">על המסך</span>
      </h1>

      <p className="hero-sub">{heroSub}</p>

      <div className="hero-cta">
        <Link href="#work" className="btn btn-primary">
          לצפייה בעבודות ↓
        </Link>
        <Link href="#contact" className="btn btn-secondary">
          בואו נדבר
        </Link>
      </div>
    </section>
  );
}
