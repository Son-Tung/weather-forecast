import React, { useState } from 'react'
import WeatherLogo from '../../assets/images/svg/IMG.jpg'
import '../styles/header.scss'
import { lstCities } from '../../assets/cities'
import { forecastWeather } from '../services/api'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Link } from 'react-router-dom'

function Header({ city, setCity, setWeather }: any) {
  // const [city, setCity] = useState<string>('')
  // const [weather, setWeather] = useState<any>(null)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [filteredCities, setFilteredCities] = useState<any[]>([])

  const handleCityChange = (input: string) => {
    setCity(input)
    try {
      if (input.length > 0) {
        const filtered = lstCities.filter((city) => city.name.toLowerCase().includes(input.toLowerCase()))

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
    getWeather(city)
  }

  const getWeather = async (scopeCity?: string) => {
    try {
      const data = await forecastWeather(scopeCity || city)
      setWeather(data)
      setFilteredCities([])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredCities?.length) {
        getWeather(filteredCities[0].name)
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
              {filteredCities?.length === 0 && city?.length > 0 && <div>No data</div>}
            </div>
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/map'>Map</Link>
            </li>
            <li>
              <Link to='/news'>Tin tức</Link>
            </li>
            <li>
              <Link to='/air-quality'>Không khí</Link>
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
