import React, { useEffect, useState } from 'react'
import '../styles/WeatherDashboard.css'
import UVIcon from '../../assets/images/uv.svg'
import Feellike from '../../assets/images/feellike.svg'
import Temp from '../../assets/images/temp.svg'
import Press from '../../assets/images/press.svg'
import AQI from '../../assets/images/aqi.svg'
import Wind from '../../assets/images/wind.svg'
import { http } from '../services/BaseService'

interface WeatherDashboardProps {
  city: any
}

const apiKey = 'bd9cebe293c14de7bca104557242309'

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ city }) => {
  const [weatherDashboard, setWeatherDashboard] = useState<any>(undefined)
  const [loading, setLoading] = useState(false)

  const getPressureInInches = (currentData: any) => {
    return (currentData?.pressure_mb * 0.02953).toFixed(2)
  }

  const getTempDescription = () => {
    const today = weatherDashboard?.forecast?.forecastday?.[0]
    if (!today) return ''

    const hottest = today.hour.reduce((a: any, b: any) =>
      b.temp_c > a.temp_c ? b : a
    )

    const peakTime = new Date(hottest.time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    return `Peak ${Math.round(today.day.maxtemp_c)}° at ${peakTime}, low ${Math.round(today.day.mintemp_c)}°.`
  }

  const getFeelsLikeDescription = () => {
    const temp = weatherDashboard?.current?.temp_c
    const feels = weatherDashboard?.current?.feelslike_c
    if (!temp || !feels) return ''

    const diff = feels - temp
    if (diff > 2) return 'Feels warmer due to humidity.'
    if (diff < -2) return 'Feels cooler due to wind.'
    return 'Feels similar to actual temperature.'
  }

  const getHumidityDescription = () => {
    const h = weatherDashboard?.current?.humidity
    if (h > 80) return 'Very humid conditions.'
    if (h > 60) return 'Moderate humidity.'
    if (h > 40) return 'Comfortable humidity.'
    return 'Dry air.'
  }

  const getWindDescription = () => {
    const w = weatherDashboard?.current?.wind_kph
    if (w > 40) return 'Strong winds expected.'
    if (w > 20) return 'Moderate winds.'
    return 'Light winds.'
  }

  const getVisibilityDescription = () => {
    const v = weatherDashboard?.current?.vis_km
    if (v > 10) return 'Excellent visibility.'
    if (v > 5) return 'Moderate visibility.'
    return 'Low visibility.'
  }

  const getAQIDescription = () => {
    const pm25 = weatherDashboard?.current?.air_quality?.pm2_5
    if (!pm25) return ''

    if (pm25 > 100) return 'Air quality is very unhealthy.'
    if (pm25 > 50) return 'Air quality is poor.'
    if (pm25 > 25) return 'Air quality is moderate.'
    return 'Air quality is good.'
  }

  const getUVDescription = () => {
    const uv = weatherDashboard?.current?.uv
    if (uv > 8) return 'Very high UV exposure.'
    if (uv > 5) return 'High UV exposure.'
    if (uv > 2) return 'Moderate UV.'
    return 'Low UV.'
  }

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const fetchWeather = async (city: string) => {
    setLoading(true)
    try {
      const response = await http.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=yes&alerts=yes&lang=vi`
      )
      setWeatherDashboard(response.data)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [city])

  return (
    <>
      {!loading ? (
        <div className='dashboard'>
          <div className='card card-temperature'>
            <span className='dashboard-name'>Temperature</span>
            <div className='temp-dsc'>
              <img src={Temp}></img>
              <span className='temper'>{Math.ceil(weatherDashboard?.current?.temp_c)}°</span>
            </div>
            <div className='temp-details'>
              <p className='temp-warning'>Rising</p>
              <p className='temp-description'>{getTempDescription()}</p>
            </div>
          </div>

          <div className='card feelslike'>
            <span className='dashboard-name'>FeelLike</span>
            <img src={Feellike} alt='Fl' className='fl-icon' />
            <div className='feellike-container'>
              <div>
                <span className='feellike-container-label'>Feelslike-temp:</span>
                <span className='feellike-container-temp'>{Math.ceil(weatherDashboard?.current.feelslike_c)}°</span>
              </div>
              <div>
                <span className='feellike-container-label'>Temperature:</span>
                <span className='feellike-container-temp'>{Math.ceil(weatherDashboard?.current.temp_c)}°</span>
              </div>
            </div>
            <div className='feellike-details'>
              <p className='feelike-warning'>Warm</p>
              <p className='feellike-description'>{getFeelsLikeDescription()}</p>
            </div>
          </div>

          <div className='card humidity'>
            <span className='dashboard-name'>Humidity</span>
            <div className='humid-content'>
              <div className='humid-content-img'>
                {[...Array(7)].map((_, i) => (
                  <div key={i} className='humidLevelBar'>
                    <div className='humidPercent'></div>
                  </div>
                ))}
              </div>
              <div className='humid-content-info'>
                <div className='hmintro'>
                  <p>{weatherDashboard?.current.humidity}%</p>
                </div>
                <span className='humid-text'>Relative Humidity</span>
                <div className='dewpoint'>
                  <p>{weatherDashboard?.current.dewpoint_c}°</p>
                </div>
                <span className='dewpoint-text'>Dewpoint</span>
              </div>
            </div>
            <div className='humid-details'>
              <p className='humid-warning'>Very Humid</p>
              <p className='humid-description'>{getHumidityDescription()}</p>
            </div>
          </div>

          <div className='card wind'>
            <span className='dashboard-name'>Wind</span>
            <div className='wind-content'>
  <div className='wind-content-img'>
    <img src={Wind} alt='Wind Icon' className='wind-icon' />
    <div className='North'>N</div>
    <div className='South'>S</div>
    <div className='West'>W</div>
    <div className='East'>E</div>
  </div>

  <div className='wind-content-info'>
    <div className='wind-title'>
      From {weatherDashboard?.current.wind_dir}
    </div>

    <div className='windintro'>
      <span className='wind-dsc'>{weatherDashboard?.current.wind_kph}</span>
      <div className='windinfo'>
        <span className='wind-unit'>km/h</span>
        <span className='wind-text'>Wind Speed</span>
      </div>
    </div>

    <div className='windintro'>
      <span className='wind-dsc'>{weatherDashboard?.current.wind_mph}</span>
      <div className='windinfo'>
        <span className='wind-unit'>mph</span>
        <span className='wind-text'>Wind Gust</span>
      </div>
    </div>
  </div>
</div>
            <div className='humid-details'>
              <p className='humid-warning'>Status</p>
              <p className='humid-description'>{getWindDescription()}</p>
            </div>
          </div>

          <div className='card pressure'>
            <span className='dashboard-name'>Pressure</span>
            <img src={Press}></img>
            <div className='press-content'>
              <span className='presscurrent'>{getPressureInInches(weatherDashboard?.current)}</span>
              <div className='pressmeme'>
                <span className='presstitle'>in</span>
                <span className='presstime'>{currentTime}(now)</span>
              </div>
            </div>
            <div className='press-details'>
              <p className='press-warning'>Stable</p>
              <p className='press-description'>Current pressure is stable.</p>
            </div>
          </div>

          <div className='card visibility'>
  <span className='dashboard-name'>Visibility</span>

  <div className='visibilityLevelBarContainer'>
    <div className='visibilityLevelBar' style={{ width: '80px', backgroundColor: 'rgb(50, 130, 80)' }}></div>
    <div className='visibilityLevelBar' style={{ width: '110px', backgroundColor: 'rgb(70, 150, 100)' }}></div>
    <div className='visibilityLevelBar' style={{ width: '140px', backgroundColor: 'rgb(100, 170, 120)' }}></div>
    <div className='visibilityLevelBar' style={{ width: '170px', backgroundColor: 'rgb(130, 190, 150)' }}></div>
    <div className='visibilityLevelBar' style={{ width: '200px', backgroundColor: 'rgb(160, 216, 185)' }}></div>
  </div>

  <div className='visibilityText'>
    <h2>{weatherDashboard?.current.vis_km}km</h2>
  </div>

  <div className='visibility-details'>
    <p className='visibility-warning'>Status</p>
    <p className='visibility-description'>{getVisibilityDescription()}</p>
  </div>
</div>

          <div className='card aqi'>
            <span className='dashboard-name'>AQI</span>
            <div className='aqi-content'>
              <img src={AQI} alt='AQI Icon' className='aqi-icon' />
              <p>{weatherDashboard?.current?.air_quality?.pm2_5}</p>
            </div>
            <div className='aqi-details'>
              <p className='aqi-warning'>Status</p>
              <p className='aqi-description'>{getAQIDescription()}</p>
            </div>
          </div>

          <div className='card uv'>
            <span className='dashboard-name'>UV</span>
            <div className='uv-content'>
              <img src={UVIcon} alt='UV Icon' className='uv-icon' />
              <p>{weatherDashboard?.current.uv}</p>
            </div>
            <div className='uv-details'>
              <p className='uv-warning'>Status</p>
              <p className='uv-description'>{getUVDescription()}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default WeatherDashboard