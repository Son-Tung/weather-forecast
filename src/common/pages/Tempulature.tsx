import React, { useEffect } from 'react'
import img from '../../assets/images/svg/IMG.jpg'

const Temperature: React.FC<{ weather: any; getWeather: (city: string) => void; setCity: (city: string) => void }> = ({
  weather,
  getWeather,
  setCity
}) => {
  function getRandomCity() {
    const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ']
    const randomIndex = Math.floor(Math.random() * cities.length)
    return cities[randomIndex]
  }
  useEffect(() => {
    const randomCity = getRandomCity()
    setCity(randomCity)
    getWeather(randomCity)
  }, [])
  return (
    <div className='Temperature'>
      <div className='pe'>
        <h2>
          <img src={img} alt='Weather '></img>Thời tiết ngày hôm nay
        </h2>
        <div>
          {weather && (
            <div>
              <p>Nhiệt độ hiện tại: {weather.main.temp}°C</p>
              <p>Tình hình thời tiết: {weather.weather[0].description}</p>
              <p>Độ ẩm: {weather.main.humidity}%</p>
              <p>
                Tốc độ gió: {weather.wind.speed} km/h ({weather.wind.deg}°)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Temperature
