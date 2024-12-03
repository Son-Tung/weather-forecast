import '../styles/detail5day.css'
import Summary from './summary.tsx'
import Hourly from './hourly.tsx'
import Details from './moredetails.tsx'
import React, { useState } from 'react'

interface Detail5dayProps {
  selectedWeather: any[]
  weather: any
  weather5day: any
  dateSelected: any
  windowWidth: any
}

const Detail5day: React.FC<Detail5dayProps> = ({ selectedWeather, weather, weather5day, dateSelected, windowWidth }) => {
  const [activeTab, setActiveTab] = useState(0)

  function handleButtonClick(display: number) {
    setActiveTab(display)
  }

  return (
    <>
      <div className='detail-5-day-container'>
        <div className='detail-5-day-sidebar'>
          <button onClick={() => handleButtonClick(0)}>
            <span className = {`${activeTab === 0 ? 'active' : ''}`}>Summary</span>
          </button>
          <button onClick={() => handleButtonClick(1)}>
            <span className = {`${activeTab === 1 ? 'active' : ''}`}>Hourly</span>
          </button>
          <button onClick={() => handleButtonClick(2)}>
            <span className = {`${activeTab === 2 ? 'active' : ''}`}>More details</span>
          </button>
        </div>

        <div className='detail-5-day-content'>
          {activeTab === 0 && selectedWeather.length != 0 && weather != null && weather5day != null && (
            <Summary weather={weather} weather5day={weather5day} dateSelected={dateSelected} windowWidth={windowWidth} />
          )}
          {activeTab === 1 && <Hourly selectedWeather={selectedWeather} windowWidth={windowWidth}/>}
          {activeTab === 2 && <Details selectedWeather={selectedWeather} weather={weather} />}
        </div>
      </div>
    </>
  )
}

export default Detail5day
