import Detail5day from '../../../common/components/detail5day'
import FivedayWeather from '../../../common/components/fivedayWeather'
import Main from '../../../common/components/main'
import MapComponent from '../../../common/components/MapComponent'
// import WeatherMap from '../../../common/components/WeatherMap'
import WeatherDashboard from './WeatherDashboard'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const Home: React.FC<{
  weather: any
  weather5day: any
  onItemSelected: (date: any, weather: any, weather5day: any) => void
  selectedWeather: any[]
  city: string
  geoData: any
  dateSelected: any
  windowWidth: any
}> = ({ weather, weather5day, onItemSelected, selectedWeather, city, geoData, dateSelected, windowWidth }) => {
  return (
    <div className='content'>
      <Main weather={weather} geoData={geoData} />
      <FivedayWeather
        weather={weather}
        weather5day={weather5day}
        windowWidth={windowWidth}
        onItemSelected={onItemSelected}
      />
      <Detail5day
        selectedWeather={selectedWeather}
        weather={weather}
        weather5day={weather5day}
        dateSelected={dateSelected}
        windowWidth={windowWidth}
      />
      <MapComponent coord={weather?.coord} city={city} weather={weather} weather5day={weather5day} />
      <WeatherDashboard city={city} />
    </div>
  )
}
export default Home
