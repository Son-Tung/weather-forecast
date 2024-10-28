import '../styles/details.css'
import { useState, useEffect } from 'react'
import { forecastWeather } from '../services/api'
import { Sun, MapPin, Thermometer, Droplet, Eye, Wind, Cloud } from 'lucide-react'
import SunriseIcon from '../../assets/images/svg/sunrise.svg'
import SunsetIcon from '../../assets/images/svg/sunset.svg'

interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    }
  ]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
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
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
    moonrise: number
    moonset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
  uvIndex: number
}

const Details: React.FC = () => {
  const [activeTab, setActiveTab] = useState('details')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const weather = await forecastWeather('London')
        console.log('Weather Data:', weather) // Check API data
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
      <div className='details-sidebar'>
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>
          Summary
        </button>
        <button className={activeTab === 'hourly' ? 'active' : ''} onClick={() => setActiveTab('hourly')}>
          Hourly
        </button>
        <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>
          More Details
        </button>
      </div>

      <div className='details-content'>
        {activeTab === 'details' && weatherData && (
          <div className='more-detail-display active'>
            <div className='weather-info'>
              <h3>Sun Information</h3>
              <div className='sun-moon-info'>
                <div className='sun-info'>
                  <div className='info-header'>
                    <Sun className='weather-icon sun' />
                    <div className='info-text'>
                      <p>UV Index</p>
                      <p className='uv-value'>
                        {weatherData.uvIndex} - {getUVLevel(weatherData.uvIndex)}
                      </p>
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
                        <p className='time'>{formatTime(weatherData.sys.sunrise)}</p>
                        <img src={SunriseIcon} alt='Sunrise' className='sunrise-icon' />
                      </div>
                      <div className='time-label sunset'>
                        <p>Sunset</p>
                        <p className='time'>{formatTime(weatherData.sys.sunset)}</p>
                        <img src={SunsetIcon} alt='Sunset' className='sunset-icon' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='weather-info'>
              <h3>Detailed Information</h3>
              <div className='weather-details'>
                <div>
                  <MapPin className='weather-icon' /> <strong>Location:</strong> {weatherData.name},{' '}
                  {weatherData.sys.country}
                </div>
                <div>
                  <MapPin className='weather-icon' /> <strong>Coordinates:</strong> {weatherData.coord.lat},{' '}
                  {weatherData.coord.lon}
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Temperature:</strong> {weatherData.main.temp}°C
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Feels Like:</strong> {weatherData.main.feels_like}°C
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Min Temperature:</strong> {weatherData.main.temp_min}
                  °C
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Max Temperature:</strong> {weatherData.main.temp_max}
                  °C
                </div>
                <div>
                  <Droplet className='weather-icon' /> <strong>Pressure:</strong> {weatherData.main.pressure} hPa
                </div>
                <div>
                  <Droplet className='weather-icon' /> <strong>Humidity:</strong> {weatherData.main.humidity}%
                </div>
                <div>
                  <Eye className='weather-icon' /> <strong>Visibility:</strong> {weatherData.visibility} m
                </div>
                <div>
                  <Wind className='weather-icon' /> <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
                </div>
                <div>
                  <Wind className='weather-icon' /> <strong>Wind Direction:</strong> {weatherData.wind.deg}°
                </div>
                <div>
                  <Cloud className='weather-icon' /> <strong>Clouds:</strong> {weatherData.clouds.all}%
                </div>
                <div>
                  <strong>Last Updated:</strong> {new Date(weatherData.dt * 1000).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const getUVLevel = (uvIndex: number) => {
  if (uvIndex >= 0 && uvIndex <= 2) return 'Low'
  if (uvIndex >= 3 && uvIndex <= 5) return 'Moderate'
  if (uvIndex >= 6 && uvIndex <= 7) return 'High'
  if (uvIndex >= 8 && uvIndex <= 10) return 'Very High'
  return 'Extreme'
}

export default Details
