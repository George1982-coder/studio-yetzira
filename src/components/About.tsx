import { aboutParagraphs } from "@/lib/content";

export function About() {
  return (
    <section id="about">
      <div className="about">
        <div>
          {aboutParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="about-tagline">
          <p>
            נעשה ביד, <span className="tagline-accent">נחשב מראש</span>
          </p>
        </div>
      </div>
    </section>
  );
}
