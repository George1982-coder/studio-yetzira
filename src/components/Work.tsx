import Image from "next/image";
import Link from "next/link";
import { workItems, workSectionLabel } from "@/lib/content";

export function Work() {
  return (
    <section id="work">
      <div className="section-head">
        <h2 className="section-title">עבודות נבחרות</h2>
        <p className="section-label">{workSectionLabel}</p>
      </div>
      <div className="work-grid">
        {workItems.map((item) => {
          const cardClass = [
            "work-card",
            item.image ? "work-card--has-image" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const content = (
            <>
              <span className="num">{item.num}</span>
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="work-card-image"
                  style={
                    "imagePosition" in item &&
                    typeof item.imagePosition === "string"
                      ? { objectPosition: item.imagePosition }
                      : undefined
                  }
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              ) : null}
              <div className="tint" aria-hidden="true" />
              <div className="meta">
                <span className="kind">{item.kind}</span>
                <div className="title">{item.title}</div>
              </div>
            </>
          );

          if (item.url) {
            return (
              <Link
                key={item.num}
                href={item.url}
                className={cardClass}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} — פתיחה באתר`}
              >
                {content}
              </Link>
            );
          }

          return (
            <article key={item.num} className={cardClass}>
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
