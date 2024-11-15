import '../styles/detail5day.css'
import Summary from './summary.tsx'
import Hourly from './hourly.tsx'
import Details from './details.tsx'


import React, { useState, useRef } from 'react'

interface Detail5dayProps {
  selectedWeather: any[]
  weather: any
  weather5day: any
}

const Detail5day: React.FC<Detail5dayProps> = ({ selectedWeather, weather, weather5day }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  function handleButtonClick(display: number) {
    setActiveTab(display)
  }

  return (
    <>
      <div className='detail-5-day-sidebar'>
        <button className={`${activeTab === 0 ? 'active' : ''} summary-button`} onClick={() => handleButtonClick(0)}>
          Summary
        </button>
        <button className={`${activeTab === 1 ? 'active' : ''} every-hour-button`} onClick={() => handleButtonClick(1)}>
          Hourly
        </button>
        <button
          className={`${activeTab === 2 ? 'active' : ''} more-detail-button`}
          onClick={() => handleButtonClick(2)}
        >
          More details
        </button>
      </div>

      <div className='detail-5-day-content' ref={contentRef}>
        {activeTab === 0 && selectedWeather.length != 0 && weather!= null && weather5day!= null && <Summary selectedWeather = {selectedWeather} weather={weather} weather5day={weather5day} />}
        {activeTab === 1 && <Hourly  selectedWeather = {selectedWeather} contentRef={contentRef} />}
        {activeTab === 2 && <Details selectedWeather = {selectedWeather} weather={weather} />}
      </div>
    </>
  )
}

export default Detail5day
