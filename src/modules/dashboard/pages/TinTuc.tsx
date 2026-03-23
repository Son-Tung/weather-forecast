import "./TinTuc.scss";
import React, { useEffect, useState } from "react";

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description: string;
}

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description: string;
}

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

const Info: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = "weather";
  const rssUrl = `${RSS2JSON}${encodeURIComponent(
    `https://news.google.com/rss/search?q=${query}`
  )}`;

  // ✅ Clean text từ HTML
  const cleanText = (html: string, title?: string) => {
    if (typeof window === "undefined") return "";

    const div = document.createElement("div");
    div.innerHTML = html || "";
    let text = (div.textContent || "").trim();

    if (title && text.startsWith(title)) {
      text = text.replace(title, "").trim();
    }

    return text;
  };

  // ✅ Extract ảnh từ description
  const extractImage = (html: string): string | null => {
    if (typeof window === "undefined") return null;

    const div = document.createElement("div");
    div.innerHTML = html || "";

    const img = div.querySelector("img");
    return img ? img.getAttribute("src") : null;
  };

  // ✅ Fetch dữ liệu
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(rssUrl);

      if (!res.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await res.json();

      const items: Article[] = (data.items || []).map((x: RSSItem) => ({
        title: x.title,
        link: x.link,
        pubDate: x.pubDate,
        thumbnail: x.thumbnail,
        description: x.description,
      }));

      setArticles(items);
    } catch (err: any) {
      console.error(err);
      setError("Không tải được tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const main = articles[0];
  const list = articles.slice(1, 10);

  // ✅ Ưu tiên: thumbnail → ảnh trong description → fallback
  const getImage = (item: Article, i: number) =>
    item.thumbnail ||
    extractImage(item.description) ||
    `https://picsum.photos/seed/news-${i}/800/500`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="news">
      <h1 className="news__title">Weather News</h1>

      {loading && <div className="news__loading">Loading...</div>}

      {error && <div className="news__error">{error}</div>}

      {!loading && !error && articles.length === 0 && (
        <div className="news__empty">No news found</div>
      )}

      {!loading && main && (
        <>
          {/* MAIN */}
          <a
            href={main.link}
            target="_blank"
            rel="noopener noreferrer"
            className="news__hero"
          >
            <img
              src={getImage(main, 0)}
              alt={main.title}
              loading="lazy"
            />
            <div className="news__overlay">
              <span className="news__tag">Top story</span>
              <h2>{main.title}</h2>
              <p>{cleanText(main.description, main.title)}</p>
            </div>
          </a>

          {/* GRID */}
          <div className="news__grid">
            {list.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="news__card"
              >
                <img
                  src={getImage(item, i)}
                  alt={item.title}
                  loading="lazy"
                />

                <div className="news__cardOverlay">
                  <h3>{item.title}</h3>
                  <span>{formatDate(item.pubDate)}</span>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Info;