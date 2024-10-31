import React, { useEffect, useState } from 'react'
import '../../../assets/styles/WeatherDashboard.css'
import UVIcon from '../../../assets/images/svg/uv.svg'
import Feellike from '../../../assets/images/svg/feellike.svg'
import Temp from '../../../assets/images/svg/temp.svg'
import Press from '../../../assets/images/svg/press.svg'
import AQI from '../../../assets/images/svg/aqi.svg'
import Wind from '../../../assets/images/svg/wind.svg'
import { http } from '../../../common/services/BaseService'
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
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const fetchWeather = async (city: string) => {
    setLoading(true)
    try {
      const response = await http.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=yes&alerts=yes&lang=vi`
      )
      console.log(response.data)
      setWeatherDashboard(response.data)
      setLoading(false)
    } catch (err) {
      console.log('Không thể lấy dữ liệu thời tiết. Vui lòng thử lại.')
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
          <div className='card-temperature'>
          <span className='dashboard-name'>Temperature</span>
            <div className='temp-dsc'>
              <img src={Temp}></img>
              <span className='temper'>{Math.ceil(weatherDashboard?.current?.temp_c)}°</span>
            </div>
            <div className='temp-details'>
              <p className='temp-warning'>
                Rising
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/up.svg' alt=''></img>
              </p>
              <p className='temp-description'>Rising with a peak of 32° at 1:00 PM. Overnight low of 25° at 4:00 AM.</p>
            </div>
          </div>
          <div className='card feelslike'>
            <span  className='dashboard-name'>FeelLike</span>
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
              <p className='feelike-warning'>
                Warm
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/up.svg' alt=''></img>
              </p>
              <p className='feellike-description'>Feel warmer than the temperature by humidity.</p>
            </div>
          </div>

          <div className='card humidity'>
          <span className='dashboard-name'>Humidity</span>
            <div className='humid-content'>
              <div className='humid-content-img'>
                <div className='humidLevelBar'>
                  <div className='humidPercent'></div>
                </div>
                <div className='humidLevelBar'>
                  <div className='humidPercent'></div>
                </div>
                <div className='humidLevelBar'>
                  <div className='humidPercent'></div>
                </div>
                <div className='humidLevelBar'>
                  <div className='humidPercent'></div>
                </div>
                <div className='humidLevelBar'>
                  <div className='humidPercent'></div>
                </div>
                <div className='humidLevelBar'>
                  <div className='humidPercent'></div>
                </div>
                <div className='humidLevelBar'>
                  <div className='humidPercent'></div>
                </div>
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
              <p className='humid-warning'>
                Very Humid
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg'></img>
              </p>
              <p className='humid-description'>Decreasing with a low of 58% ay 1.00PM</p>
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
                <div className='wind-title'>From NW(31°)</div>
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
                    <span className='wind-unit'>mPh</span>
                    <span className='wind-text'>Wind Gust</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='humid-details'>
              <p className='humid-warning'>
                Force3(gentleFreeze)
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg'></img>
              </p>
              <p className='humid-description'>
                Currently the wind is coming from NW averaging 8 mph (gusting to 23) and...
              </p>
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
              <p className='press-warning'>
                Rising slowly
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/up.svg'></img>
              </p>
              <p className='press-description'>
                Rising slowly in the last 3 hours. Expected to rise slowly in the next 3 hours.
              </p>
            </div>
          </div>
          <div className='card visibility'>
          <span className='dashboard-name'>Visibility</span>
            <div className='visibilityLevelBarContainer'>
              <div className='visibilityLevelBar' style={{ width: '80px', backgroundColor: 'rgb(50, 130, 80)' }}></div>
              <div
                className='visibilityLevelBar'
                style={{ width: '110px', backgroundColor: 'rgb(70, 150, 100)' }}
              ></div>
              <div
                className='visibilityLevelBar'
                style={{ width: '140px', backgroundColor: 'rgb(100, 170, 120)' }}
              ></div>
              <div
                className='visibilityLevelBar'
                style={{ width: '170px', backgroundColor: 'rgb(130, 190, 150)' }}
              ></div>
              <div
                className='visibilityLevelBar'
                style={{ width: '200px', backgroundColor: 'rgb(160, 216, 185)' }}
              ></div>
            </div>
            <div className='visibilityText'>
              <h2>{weatherDashboard?.current.vis_km}km</h2>
            </div>
            <div className='visibility-details'>
              <p className='visibility-warning'>
                Excellent
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg' alt=''></img>
              </p>
              <p className='visibility-description'>Tomorrow's visibility is expected to be similar to today.</p>
            </div>
          </div>
          <div className='card aqi'>
          <span className='dashboard-name'>AQI</span>
            <div className='aqi-content'>
              <img src={AQI} alt='AQI Icon' className='aqi-icon' />
              <p>{weatherDashboard?.current?.air_quality?.co}</p>
            </div>
            <div className='aqi-details'>
              <p className='aqi-warning'>
                Poor
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg' alt=''></img>
              </p>
              <p className='aqi-description'>
                Air quality is poor. And it has a deteriorating trend. The primary pollutant is: PM2.5 59 μg/m³.
              </p>
            </div>
          </div>

          <div className='card uv'>
          <span className='dashboard-name'>UV</span>
            <div className='uv-content'>
              <img src={UVIcon} alt='UV Icon' className='uv-icon' />
              <p>{weatherDashboard?.current.uv}</p>
            </div>
            <div className='uv-details'>
              <p className='uv-warning'>
                High
                <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/up.svg' alt=''></img>
              </p>
              <p className='uv-description'>Maximum UV exposure for today will be high, expected at 1:00 PM.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default WeatherDashboard
