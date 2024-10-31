import Detail5day from '../../../common/components/detail5day'
import FivedayWeather from '../../../common/components/fivedayWeather'
import Main from '../../../common/components/main'
import WeatherDashboard from './WeatherDashboard'

const HoMe: React.FC<{
  weather: any
  getWeather: (city: string) => Promise<void>
  weather5day: any
  onItemSelected: (date: any, weather5day: any) => void
  selectedWeather: any[]
  city: string
}> = ({ weather, getWeather, weather5day, onItemSelected, selectedWeather, city }) => {
  return (
    <div className='content'>
      <Main weather={weather} />
      <FivedayWeather weather5day={weather5day} getWeather={getWeather} onItemSelected={onItemSelected} />
      <Detail5day weather={weather} selectedWeather={selectedWeather} />
      <WeatherDashboard city={city} />
    </div>
  )
}
export default HoMe
