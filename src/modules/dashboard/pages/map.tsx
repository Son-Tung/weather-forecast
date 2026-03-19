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
  coord?: CoordProps // ✅ cho phép undefined để tránh crash
  city?: string
}

const DEFAULT_COORD = {
  lat: 21.0285,
  lon: 105.8542
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

  // ================= INIT MAP =================
  useEffect(() => {
    goongjs.accessToken = 'tnYpbmYpdwWTosjeGsOSrjAXEmf3JLeDbzzWzFys'

    const map = new goongjs.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: [DEFAULT_COORD.lon, DEFAULT_COORD.lat], // ✅ fallback luôn hợp lệ
      zoom: 7
    })

    map.addControl(new goongjs.NavigationControl(), 'top-left')

    mapRef.current = map

    return () => map.remove()
  }, [])

  // ================= UPDATE MARKER =================
  useEffect(() => {
    if (!mapRef.current) return

    console.log('coord received:', coord) // 🔥 debug

    // ✅ validate coord
    const isValid =
      coord &&
      typeof coord.lat === 'number' &&
      typeof coord.lon === 'number' &&
      coord.lat >= -90 &&
      coord.lat <= 90 &&
      coord.lon >= -180 &&
      coord.lon <= 180

    const lat = isValid ? coord.lat : DEFAULT_COORD.lat
    const lon = isValid ? coord.lon : DEFAULT_COORD.lon

    if (!isValid) {
      console.warn('⚠️ Invalid coord → fallback to default', coord)
    }

    // set center
    mapRef.current.setCenter([lon, lat])

    // marker
    if (markerRef.current) {
      markerRef.current.setLngLat([lon, lat])
    } else {
      markerRef.current = new goongjs.Marker()
        .setLngLat([lon, lat])
        .addTo(mapRef.current)
    }

    // popup
    const popup = new goongjs.Popup({ offset: 25 }).setHTML(
      `<h3>${city || 'Unknown location'}</h3>`
    )

    markerRef.current.setPopup(popup)
  }, [coord, city])

  // ================= WEATHER LAYER =================
  useEffect(() => {
    if (!mapRef.current) return

    const layers = {
      temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      windSpeed: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      cloudCover: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`
    }

    const sourceId = 'weather-source'
    const layerId = 'weather-layer'

    const map = mapRef.current

    const addLayer = () => {
      if (map.getSource(sourceId)) {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        map.removeSource(sourceId)
      }

      map.addSource(sourceId, {
        type: 'raster',
        tiles: [layers[mapType]],
        tileSize: 256
      })

      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId
      })
    }

    if (map.isStyleLoaded()) {
      addLayer()
    } else {
      map.once('style.load', addLayer)
    }

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch {}
    }
  }, [mapType, apiKey])

  return (
    <div className='mapweather'>
      <div className='tile'>Weather Map</div>

      <div id='map-container'>
        {/* Controls */}
        <div className='weather-controls'>
          {['temperature', 'windSpeed', 'cloudCover'].map(type => (
            <div
              key={type}
              className={`weather-option ${
                mapType === type ? 'active' : ''
              }`}
              onClick={() => setMapType(type as any)}
            >
              <span>
                {mapType === type ? '●' : '○'} {type}
              </span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div id='map' style={{ height: '100%' }} />

        <Legend type={mapType} />
      </div>
    </div>
  )
}

export default Map