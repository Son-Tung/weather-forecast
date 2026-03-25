import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useDebounce } from "use-debounce";

type ViewType = "past" | "current" | "future";

type WeatherPoint = {
  full: Date;
  temp: number;
  wind: number;
  rain: number;
};

export default function WeatherAnalytics() {
  const [data, setData] = useState<WeatherPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<ViewType>("current");

  // ================= SEARCH =================
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [location, setLocation] = useState({
    name: "Hanoi",
    lat: 21.0285,
    lon: 105.8542,
  });

  const cache = useRef<Record<string, WeatherPoint[]>>({});

  // ================= FORMAT =================
  const formatData = (
    times: string[],
    temps: number[],
    winds: number[],
    rains: number[]
  ) => {
    return times.map((t, i) => ({
      full: new Date(t),
      temp: temps[i],
      wind: winds[i],
      rain: rains[i],
    }));
  };

  const formatFull = (d: Date) =>
    `${d.getHours().toString().padStart(2, "0")}:00 ${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()}`;

  // ================= FETCH WEATHER =================
  const fetchWeather = async (lat: number, lon: number) => {
    const key = `${lat}-${lon}`;

    if (cache.current[key]) {
      setData(cache.current[key]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const pastStart = new Date(today);
    pastStart.setDate(today.getDate() - 5);

    const pastEnd = new Date(today);
    pastEnd.setDate(today.getDate() - 1);

    const currentDate = formatDate(today);

    const futureStart = new Date(today);
    futureStart.setDate(today.getDate() + 1);

    const futureEnd = new Date(today);
    futureEnd.setDate(today.getDate() + 5);

    const urlBase =
      "hourly=temperature_2m,windspeed_10m,precipitation";

    const [pastRes, currentRes, futureRes] = await Promise.all([
      fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(
          pastStart
        )}&end_date=${formatDate(pastEnd)}&${urlBase}`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&${urlBase}&start_date=${currentDate}&end_date=${currentDate}`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&${urlBase}&start_date=${formatDate(
          futureStart
        )}&end_date=${formatDate(futureEnd)}`
      ),
    ]);

    const pastJson = await pastRes.json();
    const currentJson = await currentRes.json();
    const futureJson = await futureRes.json();

    const merged = [
      ...formatData(
        pastJson.hourly.time,
        pastJson.hourly.temperature_2m,
        pastJson.hourly.windspeed_10m,
        pastJson.hourly.precipitation
      ),
      ...formatData(
        currentJson.hourly.time,
        currentJson.hourly.temperature_2m,
        currentJson.hourly.windspeed_10m,
        currentJson.hourly.precipitation
      ),
      ...formatData(
        futureJson.hourly.time,
        futureJson.hourly.temperature_2m,
        futureJson.hourly.windspeed_10m,
        futureJson.hourly.precipitation
      ),
    ].sort((a, b) => a.full.getTime() - b.full.getTime());

    cache.current[key] = merged;
    setData(merged);
    setLoading(false);
  };

  // ================= SEARCH CITY =================
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

  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, [location]);

  // ================= FILTER =================
  const chartData = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    if (view === "past") return data.filter((d) => d.full < start);
    if (view === "future") return data.filter((d) => d.full > end);

    return data.filter((d) => d.full >= start && d.full <= end);
  }, [data, view]);

  const nowPoint = useMemo(() => {
    const now = new Date();
    return chartData.find((d) => d.full >= now);
  }, [chartData]);

  // ================= AXIS =================
  const formatTick = (value: number) => {
    const d = new Date(value);
    const hour = d.getHours();

    if (hour === 0 || hour === 23) {
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }
    return "";
  };

  // ================= TOOLTIP =================
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload.full;

      return (
        <div
          style={{
            background: "rgba(2,6,23,0.9)",
            padding: "10px",
            borderRadius: "10px",
            color: "white",
          }}
        >
          <div style={{ fontSize: 12 }}>{formatFull(d)}</div>
          <div>{payload[0].value}</div>
        </div>
      );
    }
    return null;
  };

  // ================= CHART =================
  const WeatherChart = ({ dataKey, color, title }: any) => (
    <div className="chart-card">
      <div className="chart-title">{title}</div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={dataKey} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#334155" strokeDasharray="3 6" />

          <XAxis
            dataKey="full"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            stroke="#94a3b8"
            tickFormatter={formatTick}
          />

          <YAxis stroke="#94a3b8" />

          {view === "current" && nowPoint && (
            <ReferenceLine
              x={nowPoint.full.getTime()}
              stroke="#facc15"
              strokeDasharray="4 4"
              label="Now"
            />
          )}

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#${dataKey})`}
            strokeWidth={2.5}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  // ================= UI =================
  return (
    <div className="container">
      <style>{`
        .container {
          padding: 24px;
          min-height: 100vh;
          background: radial-gradient(circle at top, #1e293b, #020617);
          color: white;
          font-family: Inter, sans-serif;
        }

        .search-box {
          position: relative;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid #334155;
          background: rgba(15, 23, 42, 0.8);
          color: white;
        }

        .suggestions {
          position: absolute;
          width: 100%;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 12px;
          margin-top: 8px;
          max-height: 220px;
          overflow-y: auto;
          z-index: 50;
          border: 1px solid #334155;
        }

        .suggestion-item {
          padding: 12px;
          cursor: pointer;
        }

        .suggestion-item:hover {
          background: #1e293b;
        }

        .btn {
          margin-right: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #1e293b;
          color: #94a3b8;
          border: none;
        }

        .btn.active {
          background: #38bdf8;
          color: black;
        }

        .chart-card {
          height: 320px;
          margin-bottom: 20px;
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 16px;
        }
      `}</style>

      <h2>Weather — {location.name}</h2>

      {/* SEARCH */}
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

      {/* VIEW BUTTON */}
      <div style={{ marginBottom: 16 }}>
        {["past", "current", "future"].map((v) => (
          <button
            key={v}
            className={`btn ${view === v ? "active" : ""}`}
            onClick={() => setView(v as ViewType)}
          >
            {v}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <WeatherChart dataKey="temp" title="Temperature (°C)" color="#38bdf8" />
          <WeatherChart dataKey="wind" title="Wind (km/h)" color="#22c55e" />
          <WeatherChart dataKey="rain" title="Rain (mm)" color="#60a5fa" />
        </>
      )}
    </div>
  );
}