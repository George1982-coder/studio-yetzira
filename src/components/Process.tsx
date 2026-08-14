import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <section id="process" className="section-process">
      <div className="section-head">
        <h2 className="section-title">איך עובד תהליך העבודה</h2>
        <p className="section-label">ארבעה שלבים, בלי הפתעות באמצע</p>
      </div>
      <div className="process">
        {processSteps.map((step) => (
          <article key={step.glyph} className="step">
            <div className="glyph">{step.glyph}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
