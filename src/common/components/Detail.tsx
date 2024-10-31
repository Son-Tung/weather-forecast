import { weatherImages } from '../../assets/images/weatherImages'
import '../styles/detail.scss'
// import React, { useState,  } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'
// import { fetchWeather } from '../services/api'
import SunnyImage from '../../assets/images/Screenshot_15-10-2024_101422_assets.msn.com.jpeg' // ảnh trời nắng
import RainyImage from '../../assets/images/Screenshot_15-10-2024_103233_assets.msn.com.jpeg' // ảnh trời mưa
import CloudyImage from '../../assets/images/Screenshot_15-10-2024_10259_assets.msn.com.jpeg' // ảnh trời mây
import MistImage from '../../assets/images/Screenshot 2024-10-18 093724.png' // ảnh trời sương mù
// import { lstCities } from '../../assets/cities'

function Detail({ weather }: any) {
  // const [city, setCity] = useState<string>('')
  // const [weather, setWeather] = useState<any>(null)
  // const [filteredCities, setFilteredCities] = useState<any[]>([])

  // Lọc thành phố theo đầu vào từ thanh tìm kiếm
  //  const handleCityChange = (input: string) => {
  //   setCity(input)
  //   try {
  //     if (input.length > 0) {
  //       const filtered = lstCities.filter((city) => city.name.toLowerCase().includes(input.toLowerCase()))
  //       // if(filtered?.length){
  //         setFilteredCities(filtered)
  //       // }
  //     } else {
  //       setFilteredCities([])
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // const handleCityClick = (city: string) => {
  //   setCity('')
  //   getWeather(city) // Gọi hàm để lấy thông tin thời tiết
  // }

  // const getWeather = async (scopeCity?: string) => {
  //   try {
  //     const data = await fetchWeather(scopeCity || city)
  //     setWeather(data)
  //     setFilteredCities([])
  //   } catch (error) {
  //     console.error('Error:', error)
  //   }
  // }

  //  // Xử lý sự kiện nhấn phím Enter
  //  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     if (filteredCities?.length) {
  //       getWeather(filteredCities[0].name) // Gọi hàm tìm kiếm khi nhấn Enter
  //       setCity('')
  //     }
  //   }
  // }

  return (
    <div className='App'>
      {/* Phần nội dung chính */}
      <main className='App-body'>
        {weather ? (
          <div className='weather-info'>
            <div className='weather-header'>
              <img
                src={weatherImages[weather?.weather?.[0]?.main.toLowerCase()]} // Lấy ảnh dựa trên tình trạng thời tiết
                alt={weather?.weather?.[0]?.description}
                className='weather-image'
              />
              <div className='temperature-details'>
                <h1>{weather?.main?.temp}°C</h1>
                <p className='weather-description'>
                  {weather?.weather?.[0]?.description.charAt(0).toUpperCase() +
                    weather?.weather?.[0]?.description?.slice(1)}
                </p>

                <p className='feels-like'>Feels like {weather?.main?.feels_like}°C</p>
              </div>
            </div>
            <div className='additional-info'>
              <p>Humidity: {weather?.main?.humidity}%</p>
              <p>Vision: {weather?.visibility / 1000} km</p>
              <p>Pressure: {weather?.main?.pressure} mb</p>
              <p>Wind speed: {weather?.wind?.speed} km/h</p>
              <p>Sunrise: {new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: {new Date(weather?.sys?.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        ) : (
          <p>Vui lòng tìm kiếm một địa điểm để hiển thị thông tin thời tiết.</p>
        )}
      </main>
    </div>
  )
}

export default Detail
