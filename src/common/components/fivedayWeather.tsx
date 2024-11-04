import React, { useEffect, useCallback } from 'react'
import { weatherImages } from '../../assets/images/weatherImages'
import '../styles/FiveWeather.scss'
const FivedayWeather: React.FC<{
  weather: any
  weather5day: any
  onItemSelected: (date: any, weather: any, weather5day: any) => void
}> = ({ weather, weather5day, onItemSelected }) => {
  const groupedByDay = weather5day?.list?.reduce((acc: any, curr: any) => {
    const date = new Date(curr.dt * 1000).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric'
    })
    const hour = new Date(curr.dt * 1000).getHours()
    if (hour >= 0 && hour <= 21) {
      if (!acc[date]) {
        acc[date] = {
          temp_max: curr.main.temp_max,
          temp_min: curr.main.temp_min,
          weather: curr.weather[0],
          humidity: curr.main.humidity,
          date: new Date(curr.dt * 1000)
        }
      } else {
        acc[date].temp_max = Math.max(acc[date].temp_max, curr.main.temp_max)
        acc[date].temp_min = Math.min(acc[date].temp_min, curr.main.temp_min)
        acc[date].humidity = Math.max(acc[date].humidity, curr.main.humidity)
      }
    }
    return acc
  }, {})

  const days = Object.keys(groupedByDay || {})

  const handleItemClick = useCallback(
    (index: number, listItems: NodeListOf<HTMLLIElement>, days: any, groupedByDay: any, weather: any, weather5day: any) => {
      listItems.forEach((item, idx) => {
        if (idx !== index) {
          item.classList.add('compact')
          item.style.width = '220px'
          item.style.background = 'rgb(239 242 247)'
          item.style.color = '#000000'
        } else {
          item.classList.remove('compact')
          item.style.width = '350px'
          item.style.background = '#ffffff'
        }
      })

      onItemSelected(groupedByDay[days[index]]?.date, weather, weather5day)
    },
    []
  )

  useEffect(() => {
    const listItems = document.querySelectorAll<HTMLLIElement>('.five li')
    listItems.forEach((li, index) => {
      if (index !== 0) {
        li.classList.add('compact')
        li.style.width = '220px'
        li.style.background = 'rgb(239 242 247)'
        li.style.color = '#000000'
      } else {
        li.style.width = '350px'
        li.style.background = '#ffffff'


        onItemSelected(groupedByDay[days[index]]?.date, weather, weather5day)
      }

      li.addEventListener('click', () => handleItemClick(index, listItems, days, groupedByDay, weather, weather5day))
    })
  }, [weather, weather5day, handleItemClick])

  if (!weather || !weather5day || !weather5day?.list) {
    return <p>Vui lòng tìm kiếm một địa điểm để hiển thị thông tin thời tiết.</p>
  }


  return (
    <div className='fiveday'>
      <div className='fivetitle'>
        <h4>Dự báo 5 ngày tới</h4>
        <button>XEM THEO THÁNG</button>
      </div>
      <ul className='five'>
        {days.slice(0, 5).map((day, index) => {

          const dayData = groupedByDay[day]
          return (
            <li key={index} aria-label={`Weather forecast for ${day}`}>
              <p>{day}</p>
              <p>{dayData?.temp_max}°C</p>
              <p>{dayData?.weather?.description}</p>
              <img
                src={weatherImages[dayData?.weather?.main.toLowerCase()] || weatherImages.default}
                alt={dayData?.weather?.description}
                className='weather-image'
              />
              <p>{dayData?.temp_min}°C</p>
              <p>{dayData?.humidity}%</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default FivedayWeather
