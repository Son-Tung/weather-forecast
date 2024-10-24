import React from 'react'
import './WeatherDashboard.css'
import UVIcon from './assets/uv.svg'
import Feellike from './assets/feellike.svg'
import Temp from './assets/temp.svg'
import Press from './assets/press.svg';
import AQI from './assets/aqi.svg';
import Wind from './assets/wind.svg';
interface WeatherDashboardProps {
  weatherData: any
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weatherData }) => {
  if (!weatherData) {
    return <div>Không có dữ liệu thời tiết</div>
  }
  const current = weatherData.current
  const airQuality = current.air_quality
  console.log('airQuality', airQuality)
  const coInfor = airQuality?.co

  const pressureInInches = (current.pressure_mb * 0.02953).toFixed(2);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className='dashboard'>
      <div className='card temperature'>
        <h3>Temperature</h3>
        <div className='temp-dsc'>
        <img src={Temp}></img>
        <span className='temper'>{Math.ceil(current.temp_c)}°</span>
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
        <h3>Feel Like</h3>
        <img src={Feellike} alt='Fl' className='fl-icon' />
        <div className='feellike-container'>
          <div>
            <span className='feellike-container-label'>Feelslike-temp:</span>
            <span className='feellike-container-temp'>{Math.ceil(current.feelslike_c)}°</span>

          </div>
          <div>
            <span className='feellike-container-label'>Temperature:</span>
            <span className='feellike-container-temp'>{Math.ceil(current.temp_c)}°</span>
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
        <h3>Humidity</h3>
      <div className='humid-content'>
    <div className='humid-content-img'>
      <div className="humidLevelBar" >
        <div className='humidPercent'></div>  
      </div>
      <div className="humidLevelBar" >
        <div className='humidPercent'></div>
      </div>
      <div className="humidLevelBar" >
        <div className='humidPercent'></div>
      </div>
      <div className="humidLevelBar" >
        <div className='humidPercent'></div>
      </div>
      <div className="humidLevelBar" >
        <div className='humidPercent'></div>
      </div>
      <div className="humidLevelBar" >
        <div className='humidPercent'></div>
      </div>
      <div className="humidLevelBar" >
        <div className='humidPercent'></div>
      </div>
      </div>
      <div className='humid-content-info'>
        <div className='hmintro'>
          <p>{current.humidity}%</p>
        </div>
        <span className='humid-text'>Relative Humidity</span>
        <div className='dewpoint'>
          <p>{current.dewpoint_c}°</p>
        </div>
        <span className='dewpoint-text'>Dewpoint</span>
      </div>
      
      </div>
      <div className='humid-details'>
        <p className='humid-warning'>Very Humid
          <img src="https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg"></img></p>
        <p className='humid-description'>Decreasing with a low of 58% ay 1.00PM</p>
      </div>
     

    

      
      </div>
      <div className='card wind'>
        <h3>Wind</h3>
      <div className='wind-content'>
        <div className='wind-content-img'>
        <img src={Wind} alt='Wind Icon' className='wind-icon'/>
        <div className="North" >N</div>
        <div className="South" >S</div>
        <div className="West" >W</div>
        <div className="East" >E</div>
    
        </div>
        <div className='wind-content-info'>
          <div className='wind-title'>From NW(31°)</div>
          <div className='windintro'>
            <span className='wind-dsc'>{current.wind_kph}</span>
          
          <div className='windinfo'>
            <span className='wind-unit'>km/h</span>
            <span className='wind-text'>Wind Speed</span>
          </div>
          </div>
          <div className='windintro'>
           <span className='wind-dsc'>{current.wind_mph}</span>
         
          <div className='windinfo'>
            <span className='wind-unit'>mPh</span>
            <span className='wind-text'>Wind Gust</span>
          </div>
          </div>
        </div>
      </div>
      <div className='humid-details'>
        <p className='humid-warning'>Force3(gentleFreeze)
          <img src="https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg"></img></p>
        <p className='humid-description'>Currently the wind is coming from NW averaging 8 mph (gusting to 23) and...</p>
      </div>
     
      </div>
      <div className='card pressure'>
        <h3>Pressure</h3>
        <img src={Press}></img>
    

<div className='press-content'>
      

        <span className='presscurrent'>{pressureInInches}</span>
        <div className='pressmeme'>
          <span className='presstitle'>in</span>
        <span className='presstime'>{currentTime}(now)</span>
        </div>
        </div>
    <div className='press-details'>
      <p className='press-warning'>Rising slowly
        <img src="https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/up.svg"></img>
        </p>
      <p className='press-description'>Rising slowly in the last 3 hours. Expected to rise slowly in the next 3 hours.</p>  


    </div>
      </div>
      <div className="card visibility">
        <h3>Visibility</h3>
        <div className="visibilityLevelBarContainer">
     
      <div className="visibilityLevelBar" style={{ width: '80px', backgroundColor: 'rgb(50, 130, 80)' }}></div>
      <div className="visibilityLevelBar" style={{ width: '110px', backgroundColor: 'rgb(70, 150, 100)' }}></div>
      <div className="visibilityLevelBar" style={{ width: '140px', backgroundColor: 'rgb(100, 170, 120)' }}></div>
      <div className="visibilityLevelBar" style={{ width: '170px', backgroundColor: 'rgb(130, 190, 150)' }}></div>
      <div className="visibilityLevelBar" style={{ width: '200px', backgroundColor: 'rgb(160, 216, 185)' }}></div>
    </div>
    <div className="visibilityText">
    <h2>{current.vis_km}km</h2>
    </div>
    <div className="visibility-details">
      <p className='visibility-warning'>Excellent
      <img src="https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg" alt=""></img></p>
      <p className="visibility-description">Tomorrow's visibility is expected to be similar to today.</p>
    </div>
     
      </div>
      <div className='card aqi'>
        <h3>AQI</h3>
        <div className='aqi-content'>
          <img src={AQI} alt='AQI Icon' className='aqi-icon'/>
          <p>{coInfor}</p>
        </div>
        <div className='aqi-details'>
          <p className='aqi-warning'>
            Poor
            <img src='https://assets.msn.com/staticsb/statics/pr-4772197/weather/img/trends/down.svg' alt=''></img>
          </p>
          <p className='aqi-description'>Air quality is poor. And it has a deteriorating trend. The primary pollutant is: PM2.5 59 μg/m³.</p>
        </div>
      </div>
    



      <div className='card uv'>
        <h3>UV</h3>
        <div className='uv-content'>
          <img src={UVIcon} alt='UV Icon' className='uv-icon' />
          <p>{current.uv}</p>
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
  )
}

export default WeatherDashboard
