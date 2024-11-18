import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { lstCities } from '../../assets/cities'

interface CoordProps {
  lat: number
  lon: number
}

interface WeatherMapProps {
  coord: CoordProps
  weather: any
}

const WeatherMap = ({ coord, weather }: WeatherMapProps) => {
  const apiKey = import.meta.env.OPENWEATHER_API_KEY || '4f2141f03c148886930241854489683e'
  const city = lstCities.find((city) => city.name === weather?.name)

  // if (!apiKey) {
  //   console.error('API key is missing! Please set OPENWEATHER_API_KEY in .env.')
  //   return <div>Error: API Key is missing!</div>
  // }

  return (
    // <MapContainer center={[21.028511, 105.804817]} zoom={5} style={{ height: '50vh', width: '100%' }}>
    //
    // </MapContainer>
    <MapContainer
      center={[coord?.lat ?? 21.028511, coord?.lon ?? 105.804817]}
      zoom={13}
      scrollWheelZoom={false}
      className='weather-map-screen'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <TileLayer url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`} />
      <Marker position={[coord?.lat ?? 21.028511, coord?.lon ?? 105.804817]}>
        <Popup>
          {city ? city.name : weather?.name} <br />
          Temperature: {weather?.main?.temp}°C
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default WeatherMap
