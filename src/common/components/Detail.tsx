import '../styles/detail.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
<<<<<<< HEAD
import SunnyImage from '../../assets/images/Sunny.png' // ảnh trời nắng
import RainyImage from '../../assets/images/Rain.png' // ảnh trời mưa
import CloudyImage from '../../assets/images/Cloudy.png' // ảnh trời mây
import MistImage from '../../assets/images/Mist.png' // ảnh trời sương mù
=======
import SunnyImage from '../../assets/images/pngegg (1).png' // ảnh trời nắng
import RainyImage from '../../assets/images/pngegg (2).png' // ảnh trời mưa
import CloudyImage from '../../assets/images/pngegg (3).png' // ảnh trời mây
import MistImage from '../../assets/images/pngegg (4).png' // ảnh trời sương mù
import BigRain from '../../assets/images/muatovcl.png' // ảnh trời mưa to
>>>>>>> develop

function Detail({ weather, geoData }: any) {
  const weatherImages: { [key: string]: string } = {
    clear: SunnyImage,
    rain: RainyImage,
    clouds: CloudyImage,
    mist: MistImage,
    haze: MistImage,
    frost: MistImage,
    Thunderstorm_with_rain: BigRain
    // thêm các tình trạng thời tiết khác nếu cần
  }

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
<<<<<<< HEAD
=======
                <h2><i className="fas fa-map-marker-alt"></i> {/* Icon vị trí */}
                  {geoData?.[0]?.name}</h2> {/* Hiển thị tên thành phố ở đây */}
>>>>>>> develop
                <p className='weather-description'>
                  {weather?.weather?.[0]?.description.charAt(0).toUpperCase() +
                    weather?.weather?.[0]?.description?.slice(1)}
                </p>

<<<<<<< HEAD
                <p className='feels-like'>Cảm giác thực tế: {weather?.main?.feels_like}°C</p>
              </div>
            </div>
            <div className='additional-info'>
              <p>Độ ẩm: {weather?.main?.humidity}%</p>
              <p>Tầm nhìn: {weather?.visibility / 1000} km</p>
              <p>Áp suất: {weather?.main?.pressure} mb</p>
              <p>Tốc độ gió: {weather?.wind?.speed} km/h</p>
              <p>Bình minh: {new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Hoàng hôn: {new Date(weather?.sys?.sunset * 1000).toLocaleTimeString()}</p>
=======
                <p className='feels-like'>Feels like: {weather?.main?.feels_like}°C</p>
              </div>
            </div>
            <div className='additional-info'>
              <p>Humidity: {weather?.main?.humidity}%</p>
              <p>Vision: {weather?.visibility / 1000} km</p>
              <p>Pressure: {weather?.main?.pressure} mb</p>
              <p>Wind speed: {weather?.wind?.speed} km/h</p>
              <p>Sunrise: {new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: {new Date(weather?.sys?.sunset * 1000).toLocaleTimeString()}</p>
>>>>>>> develop
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
