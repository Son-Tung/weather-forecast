import '@fortawesome/fontawesome-free/css/all.min.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Footer from './common/components/footer.tsx'
import Main from './common/components/main.tsx'
import Header from '../src/common/components/header.tsx'
import './common/styles/index.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Detail5day from './common/components/detail5day.tsx'
import { useState, useEffect, useRef } from 'react'
import { forecastWeather, fetch5day } from './common/services/api.tsx'
import { createRoot } from 'react-dom/client' // Thay thế ReactDOM.render
import FivedayWeather from './common/components/fivedayWeather.tsx'

function App() {
  const [city, setCity] = useState<string>('Hanoi')
  const [weather, setWeather] = useState<any>(null)
  const [data5day, setData5day] = useState<any>(null)
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true)
  const [loading5day, setLoading5day] = useState<boolean>(true)
  const detailSectionRef = useRef<HTMLElement>(null)

  const [weather5day, setWeather5day] = useState<any>(null)

  const getWeather = async (city: string) => {
    try {
      const weather = await forecastWeather(city)
      setWeather(weather.weatherData)
      setWeather5day(weather.forecastData)
      console.log('data', weather)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      setLoadingWeather(false) // Đánh dấu đã tải xong thời tiết
    }
  }

  const get5day = async (city: string) => {
    try {
      const data2 = await fetch5day(city)
      setData5day(data2)
    } catch (error) {
      console.error('Error fetching 5-day forecast:', error)
    } finally {
      setLoading5day(false) // Đánh dấu đã tải xong dữ liệu 5 ngày
    }
  }

  useEffect(() => {
    // Gọi song song hai API nhưng quản lý trạng thái tải riêng biệt
    getWeather(city)
    get5day(city)
  }, [city])

  const renderDetail5day = () => {
    if (detailSectionRef.current && weather && data5day) {
      const root = createRoot(detailSectionRef.current) // Tạo root mới
      root.render(<Detail5day weather={weather} data5day={data5day} />)
    }
  }

  useEffect(() => {
    if (!loadingWeather && !loading5day) {
      renderDetail5day()
    }
  }, [loadingWeather, loading5day, weather, data5day])

  return (
    <>
      <Router>
        <div className='App'>
          <Header city={city} setCity={setCity} setWeather={setWeather} />
          <div className='content'>
            <Main weather={weather} />
            <FivedayWeather weather5day={weather5day} getWeather={getWeather} />
            <section className='detail-5-day' ref={detailSectionRef}></section>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
