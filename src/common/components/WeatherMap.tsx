import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const WeatherMap: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const apiKey = import.meta.env.OPENWEATHER_API_KEY || '4f2141f03c148886930241854489683e';

  useEffect(() => {
    // Lấy dữ liệu thời tiết từ OpenWeatherMap API
    const fetchWeatherData = async () => {
      const cities = [
        { name: "Hà Nội", lat: 21.028511, lon: 105.804817 },
        { name: "Hồ Chí Minh", lat: 10.823099, lon: 106.629664 },
       
      ];

      try {
        const cityWeatherData = await Promise.all(
          cities.map(async (city) => {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();
            return {
              name: city.name,
              lat: city.lat,
              lon: city.lon,
              temperature: data.main.temp, // Nhiệt độ
            };
          })
        );
        setWeatherData(cityWeatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [apiKey]);

  if (!apiKey) {
    console.error("API key is missing! Please set OPENWEATHER_API_KEY in .env.");
    return <div>Error: API Key is missing!</div>;
  }

  return (
    <div style={{ width: "100%", height: "50vh" }}>
      <MapContainer
        center={[21.028511, 105.804817]} 
        zoom={6}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false} 
      >
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
        />
        {weatherData.map((city, index) => (
          <Marker key={index} position={[city.lat, city.lon]}>
            <Popup>
              <strong>{city.name}</strong>
              <br />
              Temperature: {city.temperature}°C
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style>
        {`
          .leaflet-control-attribution {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default WeatherMap;
