import '../styles/details.css'
import { useState, useEffect } from 'react'
import { Sun, MapPin, Thermometer, Droplet, Eye, Wind, Cloud } from 'lucide-react'
import SunriseIcon from '../../assets/images/sunrise.svg'
import SunsetIcon from '../../assets/images/sunset.svg'
import { forecastWeather } from '../services/api'

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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

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

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex >= 0 && uvIndex <= 2) return 'Low'
    if (uvIndex >= 3 && uvIndex <= 5) return 'Moderate'
    if (uvIndex >= 6 && uvIndex <= 7) return 'High'
    if (uvIndex >= 8 && uvIndex <= 10) return 'Very High'
    return 'Extreme'
  }

  return (
    <div className='details'>
      <div className='details-content'>
        {selectedWeather[0] && (
          <>
            <div className='weather-info-left'>
              <h3>Sun Information</h3>
              <div className='sun-info'>
                <div className='info-header'>
                  <Sun className='weather-icon sun' />
                  <div className='info-text'>
                    <p>UV Index</p>
                    <p className='uv-value'>
                      {selectedWeather[0].uvIndex} - {getUVLevel(selectedWeather[0].uvIndex)}
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
                      <p className='time'>{formatTime(selectedWeather[0].sys.sunrise)}</p>
                      <img src={SunriseIcon} alt='Sunrise' className='sunrise-icon' />
                    </div>
                    <div className='time-label sunset'>
                      <p>Sunset</p>
                      <p className='time'>{formatTime(selectedWeather[0].sys.sunset)}</p>
                      <img src={SunsetIcon} alt='Sunset' className='sunset-icon' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='weather-info-right'>
              <h3>Detailed Information</h3>
              <div className='weather-details'>
                <div>
                  <MapPin className='weather-icon' /> <strong>Location:</strong> {selectedWeather[0].name},{' '}
                  {selectedWeather[0].sys.country}
                </div>
                <div>
                  <MapPin className='weather-icon' /> <strong>Timezone:</strong> {weather.timezone / 3600} UTC
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Temperature:</strong> {selectedWeather[0].main.temp}
                  °C
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Feels Like:</strong>{' '}
                  {selectedWeather[0].main.feels_like}°C
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Min Temperature:</strong>{' '}
                  {selectedWeather[0].main.temp_min}°C
                </div>
                <div>
                  <Thermometer className='weather-icon' /> <strong>Max Temperature:</strong>{' '}
                  {selectedWeather[0].main.temp_max}°C
                </div>
                <div>
                  <Droplet className='weather-icon' /> <strong>Pressure:</strong> {selectedWeather[0].main.pressure} hPa
                </div>
                <div>
                  <Droplet className='weather-icon' /> <strong>Sea Level Pressure:</strong>{' '}
                  {selectedWeather[0].main.sea_level} hPa
                </div>
                <div>
                  <Droplet className='weather-icon' /> <strong>Ground Level Pressure:</strong>{' '}
                  {selectedWeather[0].main.grnd_level} hPa
                </div>
                <div>
                  <Droplet className='weather-icon' /> <strong>Humidity:</strong> {selectedWeather[0].main.humidity}%
                </div>
                <div>
                  <Eye className='weather-icon' /> <strong>Visibility:</strong> {selectedWeather[0].visibility} m
                </div>
                <div>
                  <Wind className='weather-icon' /> <strong>Wind Speed:</strong> {selectedWeather[0].wind.speed} m/s
                </div>
                <div>
                  <Wind className='weather-icon' /> <strong>Wind Direction:</strong> {selectedWeather[0].wind.deg}°
                </div>
                <div>
                  <Cloud className='weather-icon' /> <strong>Clouds:</strong> {selectedWeather[0].clouds.all}%
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
  )
}

export default Details
