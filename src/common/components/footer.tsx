import "../styles/footer.scss";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="glass-footer">
      <div className="footer-wrapper">
        {/* Top row */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand" aria-label="Weather Forecast">
            <span className="footer-logo">🌤️</span>
            <span className="footer-title">Weather Forecast</span>
          </div>

          {/* Nav */}
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/news">News</Link>
            <Link to="/map">Map</Link>
            <Link to="/air-quality">Air Quality</Link>
            <Link to="/weather-analytics">Weather Analytics</Link>
            <Link to="/sun">Sun</Link>
            <Link to="/moon">Moon</Link>
          </nav>

          {/* Actions (no new page) */}
          <div className="footer-actions" aria-label="Footer actions">
            <a
              className="footer-icon"
              href="mailto:your-email@example.com"
              aria-label="Email"
              title="Email"
            >
              ✉️
            </a>
            <a
              className="footer-icon"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              🧑‍💻
            </a>

            <button
              type="button"
              className="back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
            >
              ↑ Top
            </button>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Bottom row */}
        <div className="footer-bottom">
          <p className="footer-copy">© 2024 – {currentYear} Weather Forecast</p>
          <p className="footer-meta">Built with React • Weather & Air Quality</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;