import { useEffect } from 'react'
import goongjs from '@goongmaps/goong-js'
import '@goongmaps/goong-js/dist/goong-js.css'

const MapComponent = () => {
  useEffect(() => {
    goongjs.accessToken = 'tnYpbmYpdwWTosjeGsOSrjAXEmf3JLeDbzzWzFys'
    const map = new goongjs.Map({
      container: 'map',
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: [105.83991, 21.028],
      zoom: 9
    })

    // Example of using the map variable
    map.on('load', () => {
      console.log('Map loaded')
    })
  }, [])

  return (
    <div
      id='map'
      style={{
        display: 'flex',
        width: '80%',
        height: '400px',
        alignItems: 'center',
        justifyItems: 'center',
        margin: '0 10%'
      }}
    ></div>
  )
}

export default MapComponent
