import Detail5day from '../../../common/components/detail5day'
import FivedayWeather from '../../../common/components/fivedayWeather'
import Main from '../../../common/components/main'
import WeatherDashboard from './WeatherDashboard'

const HoMe: React.FC<{
  weather: any
  weather5day: any
  onItemSelected: (date: any, weather: any, weather5day: any) => void
  selectedWeather: any[]
  city: string
}> = ({ weather, weather5day, onItemSelected, selectedWeather, city }) => {
  return (
    <div className='content'>
      <Main weather={weather} />
      <FivedayWeather  weather={weather} weather5day={weather5day} onItemSelected={onItemSelected} />
      <Detail5day selectedWeather={selectedWeather} weather={weather}  />
      <WeatherDashboard city={city} />
    </div>
  )
}
export default HoMe
