import '@fortawesome/fontawesome-free/css/all.min.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Footer from './common/components/footer.tsx'
import { useState } from 'react'
import { fetchWeather } from './common/services/api.tsx'
import header from '../src/common/components/header.tsx'
import Main from './common/components/main.tsx'
import Header from '../src/common/components/header.tsx'

function App() {
  const [city, setCity] = useState<string>('')
  const [weather, setWeather] = useState<any>(null)

  const getWeather = async (city: string) => {
    try {
      const data = await fetchWeather(city)
      console.log('data', data)
      setWeather(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <Router>
        <div className='App'>
          <Header city={city} setCity={setCity} setWeather={setWeather} />
          <div className='content'>
            {/* <div className='Address'>
              <i className='fas fa-house'></i> <h4>{weather?.name}</h4>
              <button className='fas fa-chart-bar'></button>
            </div> */}
            <Main weather={weather} />
            <Footer />
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
