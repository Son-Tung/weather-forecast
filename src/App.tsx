import '@fortawesome/fontawesome-free/css/all.min.css'
import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from '../src/common/components/header.tsx'
import Footer from './common/components/footer.tsx'
import Home from './modules/dashboard/pages/Home.tsx'
import Map from './modules/dashboard/pages/map.tsx'
import Info from './modules/dashboard/pages/TinTuc.tsx'
import Air from './modules/dashboard/pages/KhongKhi.tsx'
import './common/styles/FiveWeather.scss'
import Details from './common/components/moredetails.tsx'
import './common/styles/all.css'

function App() {
  // khai báo sate và refs
  const [city, setCity] = useState<string>('Hanoi')
  const [weather, setWeather] = useState<any>(null)
  const [weather5day, setWeather5day] = useState<any>(null)
  const [selectedWeather, setSelectedWeather] = useState<any[]>([])
  const [geoData, setGeoData] = useState(null)

  const getDateWithoutTime = (date: Date): Date => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return new Date(year, month, day)
  }

  const onItemSelected = (date: Date, weather: any, weather5day: any) => {
    try {
      let dateNow: Date = getDateWithoutTime(new Date())
      let dateSelected: Date = getDateWithoutTime(date)
      let weatherFilter: any = []
      let startTime: Date
      let endTime: Date

      if (dateSelected.getTime() === dateNow.getTime()) {
        startTime = new Date()
        startTime.setHours(startTime.getHours() - (startTime.getHours() % 3) + 3, 0, 0)
        weatherFilter.push(weather)
      } else {
        startTime = getDateWithoutTime(date)
      }

      endTime = new Date(startTime)
      endTime.setDate(endTime.getDate() + 1)

      const startTimestamp = startTime.getTime() / 1000
      const endTimestamp = endTime.getTime() / 1000

      weather5day?.list?.forEach((getWeather: any) => {
        if (startTimestamp <= getWeather?.dt && getWeather?.dt <= endTimestamp) {
          weatherFilter.push(getWeather)
        }
      })

      setSelectedWeather(weatherFilter)
    } catch (error) {}
  }

  return (
    <>
      <Router>
        <div className='App'>
          <Header
            city={city}
            setCity={setCity}
            setWeather={setWeather}
            setWeather5day={setWeather5day}
            setGeoData={setGeoData}
          />
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  weather={weather}
                  weather5day={weather5day}
                  onItemSelected={onItemSelected}
                  selectedWeather={selectedWeather}
                  city={city}
                  geoData={geoData}
                />
              }
            />
            <Route path='/map' element={<Map />} />
            <Route path='/news' element={<Info />} />
            <Route path='/air-quality' element={<Air />} />
            <Route path='/details' element={<Details selectedWeather={selectedWeather} weather={weather} />} />{' '}
            {/* Added Details route */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
