import '@fortawesome/fontawesome-free/css/all.min.css'
import { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from '../src/common/components/header.tsx'
import Detail5day from './common/components/detail5day.tsx'
import FivedayWeather from './common/components/fivedayWeather.tsx'
import Footer from './common/components/footer.tsx'

import { forecastWeather } from './common/services/api.tsx'
import WeatherDashboard from './modules/dashboard/pages/WeatherDashboard.tsx'
import './common/styles/index.scss'
import HoMe from './modules/dashboard/pages/Home.tsx'
import Map from './modules/dashboard/pages/map.tsx'
import Info from './modules/dashboard/pages/TinTuc.tsx'
import Air from './modules/dashboard/pages/KhongKhi.tsx'

function App() {
  const [city, setCity] = useState<string>('Hanoi')
  const [weather, setWeather] = useState<any>(null)
  const [weather5day, setWeather5day] = useState<any>(null)
  const [selectedWeather, setSelectedWeather] = useState<any[]>([])
  // const [selectedIndex, setSelectedIndex] = useState(0);

  const getWeather = async (city: string) => {
    try {
      const weather = await forecastWeather(city)
      setWeather(weather.weatherData)
      setWeather5day(weather.forecastData)
      console.log('data', weather)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  useEffect(() => {
    getWeather(city)
  }, [city])

  const onItemSelected = (date: Date, weather5day: any) => {
    try {
      const startDate = new Date(date)
      const endDate = new Date(date)
      startDate.setHours(0, 0, 0)
      endDate.setHours(23, 59, 59)

      const startTimestamp = startDate.getTime() / 1000
      const endTimestamp = endDate.getTime() / 1000

      console.log('weather5day?.list', weather5day?.list)

      const weatherFilter: any = []
      weather5day?.list?.forEach((weather: any) => {
        if (startTimestamp <= weather?.dt && weather?.dt <= endTimestamp) {
          weatherFilter.push(weather)
        }
      })

      console.log(weatherFilter)

      setSelectedWeather(weatherFilter)
    } catch (error) {
      console.log('onItemSelected', error)
    }
  }

  return (
    <>
      <Router>
        <div className='App'>
          <Header city={city} setCity={setCity} setWeather={setWeather} />
          <Routes>
            <Route
              path='/'
              element={
                <HoMe
                  weather={weather}
                  getWeather={getWeather}
                  weather5day={weather5day}
                  onItemSelected={onItemSelected}
                  selectedWeather={selectedWeather}
                  city={city}
                />
              }
            />
            <Route path='/map' element={<Map />} />
            <Route path='/news' element={<Info />} />
            <Route path='/air-quality' element={<Air />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
