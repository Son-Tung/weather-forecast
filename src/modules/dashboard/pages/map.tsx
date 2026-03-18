import { useEffect, useRef, useState } from 'react'
import goongjs from '@goongmaps/goong-js'
import '@goongmaps/goong-js/dist/goong-js.css'
import '../../../common/styles/MapComponent.css'
import Legend from '../../../common/components/Legend'

interface CoordProps {
  lat: number
  lon: number
}

interface MapProps {
  coord: CoordProps
  city: string
}

const Map: React.FC<MapProps> = ({ coord, city }) => {
  const apiKey =
    import.meta.env.VITE_OPENWEATHER_API_KEY ||
    '4f2141f03c148886930241854489683e'

  const mapRef = useRef<goongjs.Map | null>(null)
  const markerRef = useRef<goongjs.Marker | null>(null)

  const [mapType, setMapType] = useState<
    'temperature' | 'windSpeed' | 'cloudCover'
  >('temperature')
  const [initialLoad, setInitialLoad] = useState(true)

  // Init map
  useEffect(() => {
    const accessToken = 'tnYpbmYpdwWTosjeGsOSrjAXEmf3JLeDbzzWzFys'

    if (!accessToken) {
      console.error('Goong Maps API key is missing')
      return
    }

    goongjs.accessToken = accessToken

    const map = new goongjs.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: [105.83991, 21.028],
      zoom: 7,
      maxZoom: 19,
      minZoom: 3
    })

    map.addControl(new goongjs.NavigationControl(), 'top-left')

    mapRef.current = map

    return () => {
      map.remove()
    }
  }, [])

  // Update marker + center
  useEffect(() => {
    if (mapRef.current && coord) {
      const { lat, lon } = coord

      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        const currentZoom = mapRef.current.getZoom()

        if (currentZoom < 7) {
          mapRef.current.setZoom(7)
        }

        mapRef.current.setCenter([lon, lat])

        if (markerRef.current) {
          markerRef.current.setLngLat([lon, lat])
        } else {
          const newMarker = new goongjs.Marker()
            .setLngLat([lon, lat])
            .addTo(mapRef.current)
          markerRef.current = newMarker
        }

        const popup = new goongjs.Popup({
          offset: 25,
          closeButton: false
        }).setHTML(`<h3>${city}</h3>`)

        markerRef.current.setPopup(popup)

        if (initialLoad) {
          markerRef.current.togglePopup()
          setInitialLoad(false)
        }
      } else {
        console.error('Invalid coordinates:', coord)
      }
    }
  }, [coord, city, initialLoad])

  // Weather layer
  useEffect(() => {
    if (!mapRef.current) return

    const layers = {
      temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      windSpeed: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      cloudCover: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`
    }

    const sourceId = 'weather-source'
    const layerId = 'weather-layer'

    const addWeatherLayer = () => {
      if (mapRef.current?.getSource(sourceId)) {
        mapRef.current.removeLayer(layerId)
        mapRef.current.removeSource(sourceId)
      }

      mapRef.current?.addSource(sourceId, {
        type: 'raster',
        tiles: [layers[mapType]],
        tileSize: 256
      })

      mapRef.current?.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId
      })
    }

    if (mapRef.current.isStyleLoaded()) {
      addWeatherLayer()
    } else {
      mapRef.current.once('style.load', addWeatherLayer)
    }

    return () => {
      const map = mapRef.current
      if (!map) return

      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch (e) {
        console.warn('Map already destroyed:', e)
      }
    }
  }, [mapType, apiKey])

  return (
    <div className='mapweather'>
      <div className='tile'>Weather Map</div>

      <div id='map-container'>
        {/* Controls */}
        <div className='weather-controls'>
          <div
            className={`weather-option ${
              mapType === 'temperature' ? 'active' : ''
            }`}
            onClick={() => setMapType('temperature')}
          >
            {mapType === 'temperature' ? (
              <span className='active-icon'>●</span>
            ) : (
              <span className='inactive-icon'>○</span>
            )}
            <span className='option-text'>Temperature</span>
          </div>

          <div
            className={`weather-option ${
              mapType === 'windSpeed' ? 'active' : ''
            }`}
            onClick={() => setMapType('windSpeed')}
          >
            {mapType === 'windSpeed' ? (
              <span className='active-icon'>●</span>
            ) : (
              <span className='inactive-icon'>○</span>
            )}
            <span className='option-text'>Wind Speed</span>
          </div>

          <div
            className={`weather-option ${
              mapType === 'cloudCover' ? 'active' : ''
            }`}
            onClick={() => setMapType('cloudCover')}
          >
            {mapType === 'cloudCover' ? (
              <span className='active-icon'>●</span>
            ) : (
              <span className='inactive-icon'>○</span>
            )}
            <span className='option-text'>Cloud Cover</span>
          </div>
        </div>

        {/* Map */}
        <div
          id='map'
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyItems: 'center'
          }}
        ></div>

        {/* Legend */}
        <Legend type={mapType} />
      </div>
    </div>
  )
}

export default Map