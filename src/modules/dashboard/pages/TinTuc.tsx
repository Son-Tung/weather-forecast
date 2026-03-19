import "./TinTuc.scss";
import React, { useEffect, useMemo, useState } from "react";

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
}

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

const Info: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const rssUrl = useMemo(() => {
    const q = "weather";
    const url = `https://news.google.com/rss/search?q=${q}`;
    return `${RSS2JSON}${encodeURIComponent(url)}`;
  }, []);

  const cleanText = (html: string, title?: string) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    let text = (div.textContent || "").trim();

    if (title && text.startsWith(title)) {
      text = text.replace(title, "").trim();
    }

    return text;
  };

  const fetchNews = async () => {
    setLoading(true);
    const res = await fetch(rssUrl);
    const data = await res.json();

    const items = (data.items || []).map((x: any) => ({
      title: x.title,
      link: x.link,
      pubDate: x.pubDate,
      thumbnail: x.thumbnail,
      description: x.description,
    }));

    setArticles(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [rssUrl]);

  const main = articles[0];
  const list = articles.slice(1, 8);

  const getImage = (item: Article, i: number) =>
    item.thumbnail || `https://picsum.photos/seed/${i}/800/500`;

  return (
    <div className="news">
      <h1 className="news__title">Weather News</h1>

      {loading && <div className="news__loading">Loading...</div>}

      {!loading && main && (
        <>
          {/* MAIN */}
          <a href={main.link} target="_blank" className="news__hero">
            <img src={getImage(main, 0)} alt="" />
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
                className="news__card"
              >
                <img src={getImage(item, i)} alt="" />

                <div className="news__cardOverlay">
                  <h3>{item.title}</h3>
                  <span>
                    {new Date(item.pubDate).toLocaleDateString()}
                  </span>
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