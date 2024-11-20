import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { lstCities } from '../../assets/cities'
import { useRef, useEffect, useState } from 'react'
import L, { Map as LeafletMap } from 'leaflet'

interface CoordProps {
  lat: number
  lon: number
}

interface WeatherMapProps {
  coord: CoordProps
  weather: any
}

const WeatherMap = ({ coord, weather }: WeatherMapProps) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '4f2141f03c148886930241854489683e'
  const city = lstCities.find((city) => city.name === weather?.name)
  const mapRef = useRef<LeafletMap | null>(null)
  const [mapType, setMapType] = useState('temperature')

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mapRef.current && mapRef.current.getContainer().contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.whenReady(() => {
        // Map is ready
      })
    }
  }, [mapRef])

  const MapUpdater = () => {
    const map = useMap()
    useEffect(() => {
      map.setView([coord?.lat ?? 21.028511, coord?.lon ?? 105.804817], map.getZoom())
    }, [coord, map])
    return null
  }

  const getGradient = (type: string) => {
    const gradients = {
      temperature:
        'linear-gradient(to right, rgb(159, 85, 181) 0%, rgb(44, 106, 187) 8.75%, rgb(82, 139, 213) 12.5%, rgb(103, 163, 222) 18.75%, rgb(142, 202, 240) 25%, rgb(155, 213, 244) 31.25%, rgb(172, 225, 253) 37.5%, rgb(194, 234, 255) 43.75%, rgb(255, 255, 208) 50%, rgb(254, 248, 174) 56.25%, rgb(254, 232, 146) 62.5%, rgb(254, 226, 112) 68.75%, rgb(253, 212, 97) 75%, rgb(244, 168, 94) 82.5%, rgb(244, 129, 89) 87.5%, rgb(244, 104, 89) 93.75%, rgb(244, 76, 73) 100%)',
      windSpeed:
        'linear-gradient(to left, rgb(158, 128, 177), rgba(116, 76, 172, 0.9), rgb(164, 123, 170), rgba(170, 128, 177, 0.84), rgba(176, 128, 177, 0.71), rgba(170, 128, 177, 0.54), rgba(170, 128, 177, 0.44), rgba(255, 255, 0, 0))',
      cloudCover:
        'linear-gradient(to right, rgba(247, 247, 255, 0) 0%, rgba(251, 247, 255, 0) 10%, rgba(244, 248, 255, 0.1) 20%, rgba(240, 249, 255, 0.2) 30%, rgba(221, 250, 255, 0.4) 40%, rgba(224, 224, 224, 0.9) 50%, rgba(224, 224, 224, 0.76) 60%, rgba(228, 228, 228, 0.9) 70%, rgba(232, 232, 232, 0.9) 80%, rgb(214, 213, 213) 90%, rgb(210, 210, 210) 95%, rgb(183, 183, 183) 100%)'
    }
    return gradients[type as keyof typeof gradients]
  }


  const Legend = () => {
    const map = useMap()

    useEffect(() => {
      const legend = new L.Control({ position: 'bottomright' })

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'legend-box');
        const grades = {
          temperature: [-40, -20, 0, 20, 40],
          windSpeed: [0, 2, 3, 4, 12, 25, 50, 100],
          cloudCover: [0, 25, 50, 75, 100],
        };
        const labels:{ [key: string]: string } = {
          temperature: 'Temperature(°C)',
          windSpeed: 'Wind Speed(m/s)',
          cloudCover: 'Clouds(%)',
        };
      
        // Thêm nhãn
        div.innerHTML += `<div class="legend-label">${labels[mapType]}</div>`;
      
        // Thêm các giá trị và gradient
        div.innerHTML += `
          <div class="legend-child">
            <div class="legend-values">
              ${grades[mapType as keyof typeof grades]
                .map((grade) => `<span>${grade}</span>`)
                .join('')}
            </div>
            <div 
              class="legend-gradient" 
              style="background: ${getGradient(mapType)};">
            </div>
          </div>
        `;
      
        return div;
      };
      
      legend.addTo(map)
      return () => {
        legend.remove()
      }
    }, [map, mapType])

    return null
  }

  return (
    <div>
      <div className='tile'>WEATHER MAP</div>
      <div className='map-container'>
        <MapContainer
          center={[coord?.lat ?? 21.028511, coord?.lon ?? 105.804817]}
          zoom={13}
          scrollWheelZoom={true}
          className='weather-map-screen'
          ref={mapRef}
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <MapUpdater />
          <Legend />
          <LayersControl position='topright'>
            <LayersControl.BaseLayer checked name='Temperature'>
              <TileLayer
                url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                eventHandlers={{
                  add: () => setMapType('temperature')
                }}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Wind Speed'>
              <TileLayer
                url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                eventHandlers={{
                  add: () => setMapType('windSpeed')
                }}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name='Cloud Cover'>
              <TileLayer
                url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`}
                eventHandlers={{
                  add: () => setMapType('cloudCover')
                }}
              />
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
