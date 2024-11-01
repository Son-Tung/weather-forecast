import '../styles/detail5day.css'
import Detail from './details.tsx'
import Hourly from './hourly.tsx'
import React, { useState, useRef } from 'react'

interface Detail5dayProps {
  selectedWeather: any[]
}

const Detail5day: React.FC<Detail5dayProps> = ({ selectedWeather }) => {
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
        <button className={`${activeTab === 2 ? 'active' : ''} more-detail-button`} onClick={() => handleButtonClick(2)}>
          More details
        </button>
      </div>

      <div className='detail-5-day-content' ref={contentRef}>
        {activeTab === 0 && <div className='summary-display'></div>}
        {activeTab === 1 && <Hourly selectedWeather = {selectedWeather} contentRef={contentRef} />}
        {activeTab === 2 && <Detail />}
      </div>
    </>
  )
}

export default Detail5day
