declare module '@goongmaps/goong-js' {
  export default goongjs
  namespace goongjs {
    let accessToken: string
    class Map {
      [x: string]: any;
      constructor(options: { 
        container: string; 
        style: string; 
        center: [number, number]; 
        zoom: number; 
        maxZoom?: number; 
        minZoom?: number; 
      })
      setCenter(center: [number, number]): void
      on(event: string, callback: () => void): void
      addControl(control: NavigationControl, position?: string): void
      addLayer(layer: Layer): void // Add this line
      removeLayer(id: string): void // Add this line
      removeSource(id: string): void // Add this line
    }
    class Marker {
      [x: string]: any;
      constructor()
      setLngLat(lngLat: [number, number]): this
      addTo(map: Map): this
      setPopup(popup: Popup): this
    }
    class Popup {
      setLngLat(lngLat: [number, number]): this
      constructor(options?: { offset?: number })
      setText(text: string): this
      setHTML(html: string): this
      addTo(map: Map): this
    }
    class NavigationControl {
      constructor(options?: { showCompass?: boolean, showZoom?: boolean })
    }
    class Layer { // Add this class
      constructor(options: { 
        id: string; 
        type: string; 
        source: Source 
      })
    }
    class Source { // Add this class
      constructor(options: { 
        type: string; 
        tiles: string[]; 
        tileSize: number 
      })
    }
  }
}
declare module 'goong-js';