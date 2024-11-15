import '../styles/moredetails.css';
import { useState, useEffect } from 'react';
import { FaSun, FaMapPin, FaThermometerHalf, FaEye, FaWind, FaCloud, FaTachometerAlt, FaWater, FaMountain, FaClock, FaTint } from 'react-icons/fa';
import SunriseIcon from '../../assets/images/sunrise.svg';
import SunsetIcon from '../../assets/images/sunset.svg';
import { forecastWeather } from '../services/api';

interface DetailsProps {
  selectedWeather: any[]
  weather: any
}
interface WeatherData {
  timezone: number
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    }
  ]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number // Áp suất ở mực nước biển
    grnd_level?: number // Áp suất ở mặt đất
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  name: string
  cod: number
  uvIndex: number // Chỉ số UV
}

const Details = ({ selectedWeather, weather }: DetailsProps) => {
  console.log('selectedWeather === ', selectedWeather.slice(0, 5));
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const weather = await forecastWeather('London');
        console.log('Weather Data:', weather); // Check API data
        setWeatherData(weather?.weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
  
    getWeatherData();
  }, []);
  
  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'N/A'; // Check for null or undefined value
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUVLevel = (uvIndex: number) => {
    console.log('UV Index:', uvIndex); // Log giá trị UV
    if (uvIndex >= 0 && uvIndex <= 2) return 'Low';
    if (uvIndex >= 3 && uvIndex <= 5) return 'Moderate';
    if (uvIndex >= 6 && uvIndex <= 7) return 'High';
    if (uvIndex >= 8 && uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="details">
      <div className="details-content">
        {selectedWeather[0] && (
          <>
            <div className="weather-info-left">
              <h3>Sun Information</h3>
              <div className="sun-info">
                <div className="info-header">
                  <FaSun className="weather-icon sun" />
                  <div className="info-text">
                    <p>UV Index</p>
                    <p className="uv-value">{selectedWeather[0].uvIndex} - {getUVLevel(selectedWeather[0].uvIndex)}</p>
                  </div>
                </div>
                <div className="path-container">
                  <div className="sun-path">
                    <div className="path-line"></div>
                    <div className="sun-indicator"></div>
                  </div>
                  <div className="time-labels">
                    <div className="time-label sunrise">
                      <p>Sunrise</p>
                      <p className="time">{formatTime(weather.sys.sunrise)}</p>
                      <img src={SunriseIcon} alt="Sunrise" className="sunrise-icon" />
                    </div>
                    <div className="time-label sunset">
                      <p>Sunset</p>
                      <p className="time">{formatTime(weather.sys.sunset)}</p>
                      <img src={SunsetIcon} alt="Sunset" className="sunset-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='weather-info-right'>
              <h3>Detailed Information</h3>
              <div className='weather-details'>
                <div>
                  <FaMapPin className='weather-icon' style={{ color: 'black' }} /> <strong>Location:</strong> {weather.name},{' '}
                  {selectedWeather[0].sys.country}
                </div>
                <div>
                  <FaClock className='weather-icon' style={{ color: 'gray' }} /> <strong>Timezone:</strong> {weather.timezone / 3600} UTC
                </div>
                <div>
                  <FaThermometerHalf className='weather-icon' style={{ color: 'red' }} /> <strong>Temperature:</strong> {selectedWeather[0].main.temp}°C
                </div>
                <div>
                  <FaThermometerHalf className='weather-icon' style={{ color: 'red' }} /> <strong>Feels Like:</strong> {selectedWeather[0].main.feels_like}°C
                </div>
                <div>
                  <FaThermometerHalf className='weather-icon' style={{ color: 'red' }} /> <strong>Min Temperature:</strong> {selectedWeather[0].main.temp_min}°C
                </div>
                <div>
                  <FaThermometerHalf className='weather-icon' style={{ color: 'red' }} /> <strong>Max Temperature:</strong> {selectedWeather[0].main.temp_max}°C
                </div>
                <div>
                  <FaTachometerAlt className='weather-icon' style={{ color: 'darkgray' }} /> <strong>Pressure:</strong> {selectedWeather[0].main.pressure} hPa
                </div>
                <div>
                  <FaWater className='weather-icon' style={{ color: 'blue' }} /> <strong>Sea Level Pressure:</strong> {selectedWeather[0].main.sea_level} hPa
                </div>
                <div>
                  <FaMountain className='weather-icon' style={{ color: 'brown' }} /> <strong>Ground Level Pressure:</strong> {selectedWeather[0].main.grnd_level} hPa
                </div>
                <div className='icon-group'>
                <FaTint className='weather-icon' style={{ color: 'blue' }} />
                <FaThermometerHalf className='weather-icon' style={{ color: 'red' }} />
                  <strong>Humidity:</strong> {selectedWeather[0].main.humidity}%
                </div>
                <div>
                  <FaEye className='weather-icon' style={{ color: 'green' }} /> <strong>Visibility:</strong> {selectedWeather[0].visibility} m
                </div>
                <div>
                  <FaWind className='weather-icon' style={{ color: 'lightblue' }} /> <strong>Wind Speed:</strong> {selectedWeather[0].wind.speed} m/s
                </div>
                <div>
                  <FaWind className='weather-icon' style={{ color: 'lightblue' }} /> <strong>Wind Direction:</strong> {selectedWeather[0].wind.deg}°
                </div>
                <div>
                  <FaCloud className='weather-icon' style={{ color: 'gray' }} /> <strong>Clouds:</strong> {selectedWeather[0].clouds.all}%
                </div>
                <div>
                  <strong>Last Updated:</strong> {new Date(selectedWeather[0].dt * 1000).toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Details;