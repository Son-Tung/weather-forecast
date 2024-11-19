import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { lstCities } from '../../assets/cities'
import { useRef, useEffect } from 'react'

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
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mapRef.current && mapRef.current.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])
  const MapUpdater = () => {
    const map = useMap()
    useEffect(() => {
      map.setView([coord?.lat ?? 21.028511, coord?.lon ?? 105.804817], map.getZoom())
    }, [coord, map])
    return null
  }

  return (
    <div>
      <div className='tile'>WEATHER MAP</div>
      <div className='map-container' ref={mapRef}>
        <MapContainer
          center={[coord?.lat ?? 21.028511, coord?.lon ?? 105.804817]}
          zoom={13}
          scrollWheelZoom={true}
          className='weather-map-screen'
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <MapUpdater />
          <LayersControl position='topright'>
            <LayersControl.BaseLayer checked name='Temperature'>
              <TileLayer url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Clouds'>
              <TileLayer url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`} />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Wind'>
              <TileLayer url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`} />
            </LayersControl.BaseLayer>
          </LayersControl>
          <Marker position={[coord?.lat ?? 21.028511, coord?.lon ?? 105.804817]}>
            <Popup>
              {city ? city.name : weather?.name} <br />
              Temperature: {weather?.main?.temp}°C
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

export default WeatherMap
