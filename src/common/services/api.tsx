const apiKey = import.meta.env.OPENWEATHER_API_KEY || '4f2141f03c148886930241854489683e'
const baseUrl = 'https://api.openweathermap.org'

export const forecastWeather = async (city: string): Promise<{ weatherData: any; forecastData: any }> => {
  try {
    const geoUrl = `${baseUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    const geoResponse = await fetch(geoUrl)
    if (!geoResponse.ok) {
      throw new Error(`Error fetching coordinates: ${geoResponse.statusText}`)
    }
    const geoData = await geoResponse.json()
    const { lat, lon } = geoData[0]

    const weatherUrl = `${baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`
    const forecastUrl = `${baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`

    const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)])

    if (!weatherResponse.ok) {
      throw new Error(`Error fetching current weather: ${weatherResponse.statusText}`)
    }
    if (!forecastResponse.ok) {
      throw new Error(`Error fetching weather forecast: ${forecastResponse.statusText}`)
    }

    const weatherData = await weatherResponse.json()
    const forecastData = await forecastResponse.json()

    return {
      weatherData,
      forecastData
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return { weatherData: null, forecastData: null }
  }
}
