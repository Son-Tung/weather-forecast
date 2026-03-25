import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDebounce } from "use-debounce";
import "./MoonPage.scss";

const { Title } = Typography;

const API_KEY = "bd9cebe293c14de7bca104557242309";

interface MoonData {
  moonrise: string;
  moonset: string;
  phase: string;
  illumination: number;
}

const MoonPhase: React.FC<{ illumination: number }> = ({ illumination }) => {
  const shadow = 100 - illumination;

  return (
    <div className="moon-wrapper">
      <div
        className="moon"
        style={{
          boxShadow: `inset ${shadow / 2}px 0 50px rgba(0,0,0,0.9)`,
        }}
      />
    </div>
  );
};

const MoonPage: React.FC = () => {
  const [moon, setMoon] = useState<MoonData | null>(null);
  const [chart, setChart] = useState<any[]>([]);

  const [location, setLocation] = useState({
    name: "Hanoi",
    lat: 21.0285,
    lon: 105.8542,
  });

  // 🔍 SEARCH
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // 🌙 FETCH
  useEffect(() => {
    const fetchMoon = async () => {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location.lat},${location.lon}&days=10`
        );

        const data = await res.json();

        const today = data.forecast.forecastday[0].astro;

        setMoon({
          moonrise: today.moonrise,
          moonset: today.moonset,
          phase: today.moon_phase,
          illumination: Number(today.moon_illumination),
        });

        setChart(
          data.forecast.forecastday.map((d: any) => ({
            date: d.date.slice(5),
            illumination: Number(d.astro.moon_illumination),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchMoon();
  }, [location]);

  // 🔍 SEARCH API
  useEffect(() => {
    if (debouncedQuery.length < 2) return;

    setSearching(true);

    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${debouncedQuery}&count=5`
    )
      .then((res) => res.json())
      .then((json) => setSuggestions(json.results || []))
      .finally(() => setSearching(false));
  }, [debouncedQuery]);

  if (!moon)
    return (
      <div className="moon-container">
        <Title className="moon-title">Loading...</Title>
      </div>
    );

  return (
    <div className="moon-container">
      <Title level={2} className="moon-title">
        🌙 Moon Dashboard — {location.name}
      </Title>

      {/* 🌙 ANIMATION */}
      <div className="moon-section">
        <MoonPhase illumination={moon.illumination} />
        <div className="moon-phase-text">
          {moon.phase} • {moon.illumination}%
        </div>
      </div>

      {/* 🔍 SEARCH */}
      <div className="search-box">
        <input
          className="search-input"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {searching && (
          <div className="suggestions">
            <div className="suggestion-item">Searching...</div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((c: any) => (
              <div
                key={c.id}
                className="suggestion-item"
                onClick={() => {
                  setLocation({
                    name: `${c.name}, ${c.country}`,
                    lat: c.latitude,
                    lon: c.longitude,
                  });
                  setQuery("");
                  setSuggestions([]);
                }}
              >
                {c.name}, {c.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌙 STATS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="moon-card">
            <Statistic title="Moonrise" value={moon.moonrise} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="moon-card">
            <Statistic title="Moonset" value={moon.moonset} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="moon-card">
            <Statistic title="Phase" value={moon.phase} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="moon-card">
            <Statistic
              title="Illumination"
              value={`${moon.illumination}%`}
            />
          </Card>
        </Col>
      </Row>

      {/* 📊 CHART */}
      <Card className="moon-chart-card">
        <Title level={4} className="moon-title">
          Moon Illumination (7 days)
        </Title>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chart}>
            <XAxis dataKey="date" stroke="#cbd5f5" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="illumination"
              stroke="#a78bfa"
              fill="rgba(167, 139, 250, 0.3)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MoonPage;