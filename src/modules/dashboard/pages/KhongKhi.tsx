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
import { lstCities } from "../../../assets/cities";
import "./KhongKhi.css";

const { Title, Text } = Typography;

interface AirData {
  aqi: number;
  components: Record<string, number>;
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
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedCity("Your Location");
        fetchAirData(pos.coords.latitude, pos.coords.longitude);
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
        `${city.name} ${city.subcountry} ${city.country}`
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
    try {
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

      fetchAirData(city.lat, city.lon);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchAirData = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const json = await res.json();
      const result = json.list[0];

      setData({
        aqi: result.main.aqi,
        components: result.components,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (_: string, option: any) => {
    setSelectedCity(`${option.city.name}, ${option.city.country}`);
    fetchByCity(option.city.name);
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

  return (
    <div className="air-container">
      {/* Search */}
      <Card className="air-card search-card">
        <AutoComplete
          style={{ width: "100%" }}
          options={options}
          onSearch={searchCity}
          onSelect={onSelect}
          placeholder="Search city..."
        />
      </Card>

      {/* AQI */}
      <Card
        className="air-card aqi-card"
        style={{ borderTop: `5px solid ${aqiInfo.color}` }}
      >
        <Title level={3}>
          <EnvironmentOutlined /> Air Quality Index
        </Title>

        {/* 👉 Thành phố hiển thị */}
        <Title level={4} style={{ marginTop: 8 }}>
          {selectedCity}
        </Title>

        <div className="aqi-wrapper">
          <Progress
            type="circle"
            percent={data.aqi * 20}
            format={() => data.aqi}
            strokeColor={aqiInfo.color}
            strokeWidth={10}
            size={160}
          />
        </div>

        <Text className="aqi-label" style={{ color: aqiInfo.color }}>
          {aqiInfo.label}
        </Text>
      </Card>

      {/* Components */}
      <Row gutter={[16, 16]}>
        {Object.entries(data.components).map(([key, value]) => (
          <Col xs={24} sm={12} md={8} lg={6} key={key}>
            <Card className="component-card">
              <Title level={5}>{key.toUpperCase()}</Title>
              <Text strong className="component-value">
                {value}
              </Text>
              <div className="unit">μg/m³</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Health */}
      <Card className="air-card" style={{ marginTop: 24 }}>
        <Title level={4}>Health Advice</Title>
        <Text>
          {data.aqi === 1 && "Air quality is excellent. Enjoy outdoor activities."}
          {data.aqi === 2 && "Air quality is acceptable."}
          {data.aqi === 3 && "Sensitive groups should limit outdoor exertion."}
          {data.aqi === 4 && "Reduce prolonged outdoor activities."}
          {data.aqi === 5 && "Avoid outdoor activities."}
        </Text>
      </Card>
    </div>
  );
};

export default Air;