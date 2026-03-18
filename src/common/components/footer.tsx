import "../styles/footer.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Load theme từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <footer className="glass-footer">
  <div className="footer-wrapper">

    {/* Top row */}
    <div className="footer-top">
      {/* Brand */}
      <div className="footer-brand">
        🌤️ <span>Weather Forecast</span>
      </div>

      {/* Nav */}
      <nav className="footer-nav">
        <Link to="/">🏠 Home</Link>
        <Link to="/news">📰 News</Link>
        <Link to="/map">🗺️ Map</Link>
        <Link to="/air-quality">🌫️ Air Quality</Link>
      </nav>

      {/* Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>

    {/* Bottom row */}
    <div className="footer-bottom">
      <p className="footer-copy">
        © 2024 - {currentYear} Weather Forecast
      </p>
    </div>

  </div>
</footer>
  );
};

export default Footer;