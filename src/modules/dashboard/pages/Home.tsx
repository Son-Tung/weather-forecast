import Detail5day from '../../../common/components/detail5day'
import FivedayWeather from '../../../common/components/fivedayWeather'
import Main from '../../../common/components/main'
import WeatherMap from '../../../common/components/WeatherMap'
import WeatherDashboard from './WeatherDashboard'

const Home: React.FC<{
  weather: any
  weather5day: any
  onItemSelected: (date: any, weather: any, weather5day: any) => void
  selectedWeather: any[]
  city: string
  geoData: any
}> = ({ weather, weather5day, onItemSelected, selectedWeather, city, geoData }) => {
  return (
    <div className='content'>
      <Main weather={weather} geoData={geoData} />
      <FivedayWeather weather={weather} weather5day={weather5day} onItemSelected={onItemSelected} />
      <Detail5day selectedWeather={selectedWeather} weather={weather} weather5day={weather5day} />
      <WeatherMap coord={weather?.coord} weather={weather} />
      <WeatherDashboard city={city} />
    </div>
  )
}
export default Home
