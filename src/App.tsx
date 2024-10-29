import '@fortawesome/fontawesome-free/css/all.min.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Footer from './common/components/footer.tsx'
import Main from './common/components/main.tsx'
import Header from '../src/common/components/header.tsx'
import './common/styles/index.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Detail5day from './common/components/detail5day.tsx'
import { useState, useEffect, useRef } from 'react'
import { forecastWeather } from './common/services/api.tsx'
import { createRoot } from 'react-dom/client' // Thay thế ReactDOM.render
import FivedayWeather from './common/components/fivedayWeather.tsx'
import Details from './common/components/details.tsx'
import WeatherDashboard from './modules/dashboard/pages/WeatherDashboard.tsx'

function App() {
  const [city, setCity] = useState<string>('Hanoi')
  const [weather, setWeather] = useState<any>(null)
  const [weather5day, setWeather5day] = useState<any>(null)
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true)
  const detailSectionRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    getWeather(city)
  }, [city])

  const renderDetail5day = () => {
    if (detailSectionRef.current && weather && weather5day) {
      const root = createRoot(detailSectionRef.current) // Tạo root mới
      root.render(<Detail5day weather={weather} weather5day={weather5day} />)
    }
  }

  useEffect(() => {
    if (!loadingWeather) {
      renderDetail5day()
    }
  }, [loadingWeather, weather, weather5day])

  return (
    <>
      <Router>
        <div className='App'>
          <Header city={city} setCity={setCity} setWeather={setWeather} />
          <div className='content'>
            <Main weather={weather} />
            <FivedayWeather weather5day={weather5day} getWeather={getWeather} />
            <section className='detail-5-day' ref={detailSectionRef}></section>
            <Details />
            <WeatherDashboard city={city} />
          </div>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
