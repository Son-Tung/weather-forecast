import React, { useEffect, useState } from 'react'
import WeatherLogo from '../../assets/images/svg/IMG.jpg'
import '../styles/header.scss'
import { lstCities } from '../../assets/cities'
import { forecastWeather } from '../services/api'
import '@fortawesome/fontawesome-free/css/all.min.css'

function Header({ city, setCity, setWeather }: any) {
  // định nghĩa component Header với 3 props: city:tên thành phố hiện tại, setcity: hàm để cập nhật tên thành phố, setweather: hàm để cập nhật dữ liệu thời thiết
  const [filteredCities, setFilteredCities] = useState<any[]>([])

  const handleCityChange = (input: string) => {
    //hàm xử lí khi người dùng nhập tên thành phố
    setCity(input) // cập nhật city với giá trị người dùng nhập
    try {
      if (input.length > 0) {
        const filtered = lstCities.filter((city) => city.name.toLowerCase().includes(input.toLowerCase())) //tìm các thành phố từ 1stcities khớp với input và lưu vào filteredcities
        setFilteredCities(filtered)
      } else {
        setFilteredCities([])
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleCityClick = (city: string) => {
    // hàm để chọn một thành phố từ danh sách gợi ý
    setCity('') // xoá giá trị hiện tại trong ô tìm kiếm
    getWeather(city) // Gọi hàm để lấy thông tin thời tiết cho thành phố đã chọn
  }

  const getWeather = async (scopeCity?: string) => {
    // hàm lấy dữ liệu thời tiết từ API
    try {
      const data = await forecastWeather(scopeCity || city)
      setWeather(data) // cập nhật dữ liệu thời tiết
      setFilteredCities([]) // xoá danh sách gợi ý thành phố
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredCities?.length) {
        getWeather(filteredCities[0].name)
        setCity('')
      }
    }
  }

  // Khởi tạo giá trị thành phố là "Hanoi" khi component được mount
  useEffect(() => {
    const initialCity = 'Hanoi'
    setCity('') // Cập nhật tên thành phố
    getWeather(initialCity) // Gọi hàm để lấy dữ liệu thời tiết
  }, []) // Chỉ chạy một lần khi component mount

  return (
    <>
      {/* Header Section */}
      <header className='App-header'>
        <div className='App-header-body'>
          <div className='header-content'>
            <div className='header-logo'>
              <img src={WeatherLogo} alt='Weather Logo' />
              <h1>Weather Forecast</h1>
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
            </nav>
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
              {filteredCities?.length === 0 && city?.length > 0 && <div></div>}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
