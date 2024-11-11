import '../styles/detail.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import SunnyImage from '../../assets/images/Sunny.png' // ảnh trời nắng
import RainyImage from '../../assets/images/Rain.png' // ảnh trời mưa
import CloudyImage from '../../assets/images/Cloudy.png' // ảnh trời mây
import MistImage from '../../assets/images/Mist.png' // ảnh trời sương mù

function Detail({ weather }: any) {
  const weatherImages: { [key: string]: string } = {
    clear: SunnyImage,
    rain: RainyImage,
    clouds: CloudyImage,
    mist: MistImage,
    haze: MistImage,
    frost: MistImage
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
                <p className='weather-description'>
                  {weather?.weather?.[0]?.description.charAt(0).toUpperCase() +
                    weather?.weather?.[0]?.description?.slice(1)}
                </p>

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
