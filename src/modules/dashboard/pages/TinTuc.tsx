import "./TinTuc.scss";
import React, { useEffect, useState } from "react";

interface Article {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
}

const Info: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=weather"
    )
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.items || []);
      });
  }, []);

  // XÓA HTML RÁC
  const cleanText = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  };

  const getImage = (item: Article, index: number) => {
    if (item.thumbnail) return item.thumbnail;
    return `https://picsum.photos/600/400?random=${index}`;
  };

  const main = articles[0];
  const list = articles.slice(1, 10);

  return (
    <div className="news">
      <h1 className="news__title">🌦 Weather News</h1>

      {/* MAIN NEWS */}
      {main && (
        <a href={main.link} target="_blank" className="news__main">
          <img src={getImage(main, 0)} alt="" />
          <div className="news__main-content">
            <h2>{main.title}</h2>
            <p>{cleanText(main.description).slice(0, 150)}...</p>
            <span>
              {new Date(main.pubDate).toLocaleDateString()}
            </span>
          </div>
        </a>
      )}

      {/* GRID */}
      <div className="news__grid">
        {list.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            className="news__card"
          >
            <img src={getImage(item, index)} alt="" />

            <div className="news__card-content">
              <h3>{item.title}</h3>
              <p>{cleanText(item.description).slice(0, 80)}...</p>
              <span>
                {new Date(item.pubDate).toLocaleDateString()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Info;