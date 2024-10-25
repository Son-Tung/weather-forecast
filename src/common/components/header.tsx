import React, { useState } from 'react'
import WeatherLogo from '../../assets/images/svg/IMG.jpg'
import '../styles/header.scss'
import { lstCities } from '../../assets/cities'
import { fetchWeather } from '../services/api'  
import '@fortawesome/fontawesome-free/css/all.min.css'
import SunnyImage from '../../assets/images/svg/Screenshot_15-10-2024_101422_assets.msn.com.jpeg' // ảnh trời nắng
import RainyImage from '../../assets/images/svg/Screenshot_15-10-2024_103233_assets.msn.com.jpeg' // ảnh trời mưa
import CloudyImage from '../../assets/images/svg/Screenshot_15-10-2024_10259_assets.msn.com.jpeg' // ảnh trời mây
import MistImage from '../../assets/images/svg/Screenshot 2024-10-18 093724.png' // ảnh trời sương mù

function Header({ city, setCity, setWeather }: any) {
  // const [city, setCity] = useState<string>('')
  // const [weather, setWeather] = useState<any>(null)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [filteredCities, setFilteredCities] = useState<any[]>([])
  const weatherImages: { [key: string]: string } = {
    clear: SunnyImage,
    rain: RainyImage,
    clouds: CloudyImage,
    mist: MistImage,
    haze: MistImage
    // thêm các tình trạng thời tiết khác nếu cần
  }

  // Lọc thành phố theo đầu vào từ thanh tìm kiếm
  const handleCityChange = (input: string) => {
    setCity(input)
    try {
      if (input.length > 0) {
        const filtered = lstCities.filter((city) => city.name.toLowerCase().includes(input.toLowerCase()))
        // if(filtered?.length){
          setFilteredCities(filtered)
        // }
      } else {
        setFilteredCities([])
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleCityClick = (city: string) => {
    setCity('')
    getWeather(city) // Gọi hàm để lấy thông tin thời tiết
  }

  const getWeather = async (scopeCity?: string) => {
    try {
      const data = await fetchWeather(scopeCity || city)
      setWeather(data)
      setFilteredCities([])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  // Xử lý sự kiện nhấn phím Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredCities?.length) {
        getWeather(filteredCities[0].name) // Gọi hàm tìm kiếm khi nhấn Enter
        setCity('')
      }
    }
  }

  return (
    <div className='App'>
      {/* Header Section */}
      <header className='App-header'>
        <div>
          <div className='logo-title'>
            <img src={WeatherLogo} alt='Weather Logo' />
            <h1>Weather Forecast</h1>
          </div>
          {/* Search bar */}
          <div className='search-container'>
            <div className='input-wrapper'>
              <input
              
                type='text'
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                placeholder='Enter city name'
              />
              <button onClick={() => getWeather()}>Search</button>
              <i className='fas fa-search search-icon'></i>
              {/* Hiển thị danh sách các thành phố gợi ý */}
              {filteredCities?.length > 0 && (
                <div className='city-suggestions'>
                  {filteredCities?.map((city) => (
                    <div key={city.geonameid} onClick={() => handleCityClick(city.name)}>
                      {city.name + ' (' + city.country + ')'}
                    </div>
                  ))}
                </div>
              )}
              {filteredCities?.length === 0 && city?.length > 0 && (<div>No data</div>)}
            </div>
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <a href='#'>Home</a>
            </li>
            <li>
              <a href='#'>Map</a>
            </li>
            <li>
              <a href='#'>Tin tức</a>
            </li>
            <li>
              <a href='#'>Không khí</a>
            </li>
          </ul>
          <a className='menu-icon' onClick={togglePopup}>
            <i className='fas fa-bell bell-icon'></i>
          </a>
        </nav>
      </header>
    

      {/* Pop-up thông báo */}
      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h3>Thông báo</h3>
            <p>Đây là thông báo của bạn.</p>
            <button onClick={togglePopup}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  )
}

  export default Header


