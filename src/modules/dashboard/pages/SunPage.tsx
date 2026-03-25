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
import "./SunPage.scss";

const { Title } = Typography;

interface SunData {
  sunrise: string;
  sunset: string;
  daylight: number;
  sunshine: number;
  uv: number;
  uvClear: number;
  cloudMean: number;
  cloudMax: number;
  radiation: number;
}

const SunPage: React.FC = () => {
  const [sun, setSun] = useState<SunData | null>(null);
  const [chart, setChart] = useState<any[]>([]);

  // ✅ LOCATION (giống bên WeatherAnalytics)
  const [location, setLocation] = useState({
    name: "Hanoi",
    lat: 21.0285,
    lon: 105.8542,
  });

  // ✅ SEARCH
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // ✅ FETCH SUN DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,cloudcover_mean,cloudcover_max,shortwave_radiation_sum&timezone=auto`
        );

        const data = await res.json();

        setSun({
          sunrise: data.daily.sunrise[0],
          sunset: data.daily.sunset[0],
          daylight: data.daily.daylight_duration[0],
          sunshine: data.daily.sunshine_duration[0],
          uv: data.daily.uv_index_max[0],
          uvClear: data.daily.uv_index_clear_sky_max[0],
          cloudMean: data.daily.cloudcover_mean[0],
          cloudMax: data.daily.cloudcover_max[0],
          radiation: data.daily.shortwave_radiation_sum[0],
        });

        setChart(
          data.daily.time.map((d: string, i: number) => ({
            date: d.slice(5),
            daylight: Math.round(data.daily.daylight_duration[i] / 3600),
            uv: data.daily.uv_index_max[i],
            cloud: data.daily.cloudcover_mean[i],
          }))
        );
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [location]);

  // ✅ SEARCH API (copy y chang)
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

  const formatTime = (t: string) =>
    new Date(t).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (s: number) =>
    `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;

  if (!sun)
    return (
      <div className="sun-container">
        <Title className="sun-title">Loading...</Title>
      </div>
    );

  return (
    <div className="sun-container">
      <Title level={2} className="sun-title">
        🌞 Sun Dashboard — {location.name}
      </Title>

      {/* 🔍 SEARCH BOX */}
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

      {/* STATS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="Sunrise" value={formatTime(sun.sunrise)} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="Sunset" value={formatTime(sun.sunset)} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="Daylight" value={formatDuration(sun.daylight)} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="Sunshine" value={formatDuration(sun.sunshine)} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="UV Index" value={sun.uv} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="UV Clear Sky" value={sun.uvClear} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="Cloud Avg (%)" value={sun.cloudMean} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic title="Cloud Max (%)" value={sun.cloudMax} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="sun-card">
            <Statistic
              title="Solar Radiation (MJ/m²)"
              value={sun.radiation}
            />
          </Card>
        </Col>
      </Row>

      {/* CHART */}
      <Card className="chart-card">
        <Title level={4} className="sun-title">
          Sun Trend (7 days)
        </Title>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chart}>
            <XAxis dataKey="date" stroke="#fff" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="daylight"
              stroke="#ffd166"
              fill="rgba(255, 209, 102, 0.4)"
            />

            <Area
              type="monotone"
              dataKey="uv"
              stroke="#ff4d4f"
              fill="rgba(255, 77, 79, 0.3)"
            />

            <Area
              type="monotone"
              dataKey="cloud"
              stroke="#69c0ff"
              fill="rgba(105, 192, 255, 0.3)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default SunPage;