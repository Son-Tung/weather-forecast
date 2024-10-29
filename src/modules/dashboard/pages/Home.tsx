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
}> = ({ weather, getWeather, weather5day, onItemSelected, selectedWeather }) => {
  return (
    <div className='content'>
      <Main weather={weather} />
      <FivedayWeather weather5day={weather5day} getWeather={getWeather} onItemSelected={onItemSelected} />
      <section className='detail-5-day'>
        {selectedWeather?.length && <Detail5day weather={weather} selectedWeather={selectedWeather} />}
      </section>
      <WeatherDashboard weatherData={weather} />
    </div>
  )
}
export default HoMe
