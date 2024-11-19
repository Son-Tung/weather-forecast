import '../styles/moredetails.css';
import { useState, useEffect } from 'react';
import { FaMapPin, FaThermometerHalf, FaEye, FaWind, FaCloud, FaTachometerAlt, FaWater, FaMountain, FaClock, FaTint, FaMapMarkerAlt } from 'react-icons/fa';
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
    gust: number
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
  coord: {
    lat: number // Vĩ độ
    lon: number // Kinh độ
  }
  name: string
  cod: number
}

const Details = ({ selectedWeather, weather }: DetailsProps) => {
  console.log('selectedWeather === ', selectedWeather.slice(0, 5));
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const weather = await forecastWeather('London')

        setWeatherData(weather?.weatherData)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    getWeatherData()
  }, [])

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'N/A' // Check for null or undefined value
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className='details'>
      <div className='details-content'>
        {selectedWeather[0] && (
          <>
            <div className='weather-info-left'>
              <h3>Current Sun Information</h3>
              <div className="sun-info">
                <div className="info-header">
                  <FaMapMarkerAlt className="weather-icon location" />
                  <div className="info-text">
                    <p>Lat and Lon</p>
                    <p className="lat-lon-value">{weather.coord.lat} and {weather.coord.lon}</p>
                  </div>
                </div>
                <div className='path-container'>
                  <div className='sun-path'>
                    <div className='path-line'></div>
                    <div className='sun-indicator'></div>
                  </div>
                  <div className='time-labels'>
                    <div className='time-label sunrise'>
                      <p>Sunrise</p>
                      <p className="time">{formatTime(weather.sys.sunrise)}</p>
                      <img src={SunriseIcon} alt="Sunrise" className="sunrise-icon" />
                    </div>
                    <div className='time-label sunset'>
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
                  <FaMapPin className='weather-icon' style={{ color: 'black' }} /> <strong>Location:</strong> {weather.name}
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
                  <FaThermometerHalf className='weather-icon' style={{ color: 'red' }} /> <strong>Humidity:</strong> {selectedWeather[0].main.humidity}%
                </div>
                <div>
                  <FaEye className='weather-icon' style={{ color: 'green' }} /> <strong>Visibility:</strong> {selectedWeather[0].visibility} m
                </div>
                <div>
                  <FaWind className='weather-icon' style={{ color: 'lightblue' }} /> <strong>Wind Gust:</strong> {selectedWeather[0].wind.gust} km/h
                </div>
                <div>
                  <FaWind className='weather-icon' style={{ color: 'lightblue' }} /> <strong>Wind Direction:</strong> {selectedWeather[0].wind.deg}°
                </div>
                <div>
                  <FaCloud className='weather-icon' style={{ color: 'gray' }} /> <strong>Clouds:</strong> {selectedWeather[0].clouds.all}%
                </div>
                <div>
                  <strong>City Info:</strong> ID: {weather.id}, Country: {weather.sys.country}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Details;
