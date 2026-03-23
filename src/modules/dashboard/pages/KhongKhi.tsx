import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Typography,
  Progress,
  AutoComplete,
} from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { ResponsiveLine } from "@nivo/line";
import { lstCities } from "../../../assets/cities";
import "./KhongKhi.scss";

const { Title, Text } = Typography;

interface AirData {
  aqi: number;
  components: Record<string, number>;
}

interface ForecastItem {
  dt: number;
  aqi: number;
}

const getAQIInfo = (aqi: number) => {
  const map = [
    { label: "Good", color: "#52c41a" },
    { label: "Fair", color: "#fadb14" },
    { label: "Moderate", color: "#fa8c16" },
    { label: "Poor", color: "#f5222d" },
    { label: "Very Poor", color: "#722ed1" },
  ];
  return map[aqi - 1] || map[0];
};

const API_KEY = "4f2141f03c148886930241854489683e";

const Air: React.FC = () => {
  const [data, setData] = useState<AirData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedCity("Your Location");
        fetchAll(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setSelectedCity("Hanoi, Vietnam");
        fetchByCity("Hanoi");
      }
    );
  }, []);

  const searchCity = (value: string) => {
    if (!value) return setOptions([]);

    const filtered = lstCities
      .filter((city: any) =>
        `${city.name} ${city.country}`
          .toLowerCase()
          .includes(value.toLowerCase())
      )
      .slice(0, 10);

    setOptions(
      filtered.map((item: any) => ({
        value: `${item.name}, ${item.country}`,
        label: `${item.name}, ${item.country}`,
        city: item,
      }))
    );
  };

  const fetchByCity = async (cityName: string) => {
    setLoading(true);

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    );
    const geo = await res.json();

    if (!geo.length) {
      alert("City not found");
      setLoading(false);
      return;
    }

    const city = geo[0];
    setSelectedCity(`${city.name}, ${city.country}`);

    fetchAll(city.lat, city.lon);
  };

  const fetchAll = async (lat: number, lon: number) => {
    try {
      setLoading(true);

      const [currentRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        ),
      ]);

      const currentJson = await currentRes.json();
      const forecastJson = await forecastRes.json();

      const current = currentJson.list[0];

      setData({
        aqi: current.main.aqi,
        components: current.components,
      });

      const nextHours = forecastJson.list.slice(0, 8).map((item: any) => ({
        dt: item.dt,
        aqi: item.main.aqi,
      }));

      setForecast(nextHours);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (_: string, option: any) => {
    setSelectedCity(`${option.city.name}, ${option.city.country}`);
    fetchByCity(option.city.name);
  };

  const formatHour = (dt: number) => {
    const d = new Date(dt * 1000);
    return d.getHours().toString().padStart(2, "0") + ":00";
  };

  if (loading) {
    return (
      <div className="air-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) return <p>No data</p>;

  const aqiInfo = getAQIInfo(data.aqi);

  const chartData = [
    {
      id: "AQI",
      data: forecast.map((item, index) => ({
        x: index === 0 ? "Now" : formatHour(item.dt),
        y: item.aqi,
      })),
    },
  ];

  return (
    <div className="air-container">
      <Card className="air-card search-card">
        <AutoComplete
          style={{ width: "100%" }}
          options={options}
          onSearch={searchCity}
          onSelect={onSelect}
          placeholder="Search city..."
        />
      </Card>

      <Card
        className="air-card aqi-card"
        style={{ borderTop: `5px solid ${aqiInfo.color}` }}
      >
        <Title level={3}>
          <EnvironmentOutlined /> Air Quality Index
        </Title>

        <Title level={4}>{selectedCity}</Title>

        <div className="aqi-wrapper">
          <Progress
            type="circle"
            percent={data.aqi * 20}
            format={() => data.aqi}
            strokeColor={aqiInfo.color}
            size={160}
          />
        </div>

        <Text style={{ color: aqiInfo.color }}>{aqiInfo.label}</Text>
      </Card>

      {/* NIVO CHART */}
      <Card className="air-card">
        <Title level={4}>AQI Trend (Next Hours)</Title>
        <div style={{ height: 300 }}>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 1, max: 5 }}
            curve="catmullRom"
            enableArea={true}
            areaOpacity={0.15}
            colors={[aqiInfo.color]}
            lineWidth={3}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            useMesh={true}
            enableSlices="x"
            axisBottom={{
              tickSize: 0,
              tickPadding: 10,
            }}
            axisLeft={{
              tickValues: [1, 2, 3, 4, 5],
            }}
            defs={[
              {
                id: "gradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: aqiInfo.color },
                  { offset: 100, color: "#ffffff" },
                ],
              },
            ]}
            fill={[{ match: "*", id: "gradient" }]}
            theme={{
              grid: {
                line: {
                  stroke: "#e5e7eb",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                },
              },
              tooltip: {
                container: {
                  background: "#111",
                  color: "#fff",
                  borderRadius: 8,
                },
              },
            }}
          />
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {Object.entries(data.components).map(([key, value]) => (
          <Col xs={24} sm={12} md={8} lg={6} key={key}>
            <Card className="component-card">
              <Title level={5}>{key.toUpperCase()}</Title>
              <Text strong>{value}</Text>
              <div>μg/m³</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="air-card" style={{ marginTop: 24 }}>
        <Title level={4}>Health Advice</Title>
        <Text>
          {data.aqi === 1 && "Air quality is excellent."}
          {data.aqi === 2 && "Air quality is acceptable."}
          {data.aqi === 3 && "Sensitive groups should be careful."}
          {data.aqi === 4 && "Reduce outdoor activities."}
          {data.aqi === 5 && "Avoid going outside."}
        </Text>
      </Card>
    </div>
  );
};

export default Air;
