import { weatherImages } from '../../assets/images/weatherImages'
import '../styles/detail.scss'

import '@fortawesome/fontawesome-free/css/all.min.css'

function Detail({ weather }: any) {
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
