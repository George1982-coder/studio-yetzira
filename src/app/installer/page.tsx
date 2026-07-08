import {
  installerConfig,
  installerReviews,
  installerServices,
  installerStats,
  installerTrustItems,
} from "@/lib/installer-content";

export default function InstallerPage() {
  const { phone, phoneHref, title } = installerConfig;

  return (
    <>
      <div className="top-bar">
        <span>📞 זמינים 24/7 לקריאות חירום</span>
        <a href={phoneHref} className="top-phone">
          {phone}
        </a>
      </div>

      <nav>
        <div className="logo">
          🔧 <span>{title}</span>
        </div>
        <div className="nav-links">
          <a href="#services">שירותים</a>
          <a href="#why">למה אנחנו</a>
          <a href="#reviews">המלצות</a>
        </div>
        <a href={phoneHref} className="nav-cta">
          התקשרו עכשיו
        </a>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">⚡ הגעה תוך 30-60 דקות</div>
          <h1>
            אינסטלטור מקצועי
            <br />
            <span className="accent">בהישג יד, מתי שצריך</span>
          </h1>
          <p className="hero-sub">
            פתרון מהיר ואמין לכל תקלת אינסטלציה - נזילות, סתימות, התקנות
            ותיקונים. שירות זמין 24/7, מחיר הוגן ואחריות על העבודה.
          </p>
          <div className="hero-cta">
            <a href={phoneHref} className="btn btn-primary">
              📞 התקשרו עכשיו
            </a>
            <a href="#contact" className="btn btn-secondary">
              בקשת הצעת מחיר
            </a>
          </div>
          <div className="trust-row">
            {installerTrustItems.map((item) => (
              <div key={item} className="trust-item">
                ✅ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="section-head">
          <span className="section-tag">שירותים</span>
          <h2>במה אנחנו מטפלים</h2>
        </div>
        <div className="services-grid">
          {installerServices.map((service) => (
            <div key={service.title} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="why">
        <div className="section-head">
          <span className="section-tag">למה לבחור בנו</span>
          <h2>שירות שאפשר לסמוך עליו</h2>
        </div>
        <div className="why-grid">
          {installerStats.map((stat) => (
            <div key={stat.label} className="why-item">
              <div className="why-num">{stat.num}</div>
              <div className="why-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews">
        <div className="section-head">
          <span className="section-tag">המלצות</span>
          <h2>מה הלקוחות אומרים</h2>
        </div>
        <div className="reviews-grid">
          {installerReviews.map((review) => (
            <div key={review.author} className="review-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>&quot;{review.text}&quot;</p>
              <div className="reviewer">— {review.author}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-box">
          <h2>יש לכם תקלת אינסטלציה?</h2>
          <p>אל תחכו שהבעיה תחמיר - התקשרו עכשיו ונגיע במהירות</p>
          <a href={phoneHref} className="btn btn-primary btn-large">
            📞 {phone}
          </a>
        </div>
      </section>

      <footer>
        <span>© 2026 {title}</span>
        <span>שירותי אינסטלציה 24/7</span>
      </footer>
    </>
  );
}
