import '@fortawesome/fontawesome-free/css/all.min.css'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from '../src/common/components/header.tsx'
import Detail5day from './common/components/detail5day.tsx'
import Details from './common/components/details.tsx'
import FivedayWeather from './common/components/fivedayWeather.tsx'
import Footer from './common/components/footer.tsx'
import Main from './common/components/main.tsx'
import { forecastWeather } from './common/services/api.tsx'
import './common/styles/index.scss'

function App() {
  const [city, setCity] = useState<string>('Hanoi')
  const [weather, setWeather] = useState<any>(null)
  const [weather5day, setWeather5day] = useState<any>(null)
  const [selectedWeather, setSelectedWeather] = useState<any[]>([])

  const getWeather = async (city: string) => {
    try {
      const totalWeather = await forecastWeather(city)
      setWeather(totalWeather.weatherData)
      setWeather5day(totalWeather.forecastData)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  useEffect(() => {
    getWeather(city)
  }, [city])

  const getDateWithoutTime = (date: Date): Date => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day);
  };

  const onItemSelected = (date: Date, weather: any, weather5day: any) => {
    try {
      const dateWithoutTime = getDateWithoutTime(date);
      const dateNow = getDateWithoutTime(new Date());
      const weatherFilter: any = []

      let startDate;
      let endDate;
      if (dateWithoutTime.getTime() === dateNow.getTime()) {
        startDate = new Date()
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        weatherFilter.push(weather)
      }

      else {
        startDate = new Date(date)
        endDate = new Date(date)
        startDate.setHours(0, 0, 0)
        endDate.setHours(23, 59, 59)
      }
      
      const startTimestamp = startDate.getTime() / 1000
      const endTimestamp = endDate.getTime() / 1000

      weather5day?.list?.forEach((getWeather: any) => {
        if (startTimestamp <= getWeather?.dt && getWeather?.dt <= endTimestamp) {
          weatherFilter.push(getWeather)
        }
      })
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
          <div className='content'>
            <Main weather={weather} />
            <FivedayWeather weather={weather} weather5day={weather5day} onItemSelected={onItemSelected} />
            <section className='detail-5-day'>
              {selectedWeather?.length && <Detail5day selectedWeather={selectedWeather} />}
            </section>
            <Details />
          </div>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
