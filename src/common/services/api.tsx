const apiKey =  '4f2141f03c148886930241854489683e'
const baseUrl = 'https://api.openweathermap.org'

export const forecastWeather = async (city: string): Promise<{ weatherData: any; forecastData: any; geoData: any }> => {
  try {
    const weatherUrl = `${baseUrl}/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&`
    const forecastUrl = `${baseUrl}/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&`

    const [weatherResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)])

    if (!weatherResponse.ok) {
      throw new Error(`Error fetching current weather: ${weatherResponse.statusText}`)
    }
    if (!forecastResponse.ok) {
      throw new Error(`Error fetching weather forecast: ${forecastResponse.statusText}`)
    }

    const weatherData = await weatherResponse.json()
    const forecastData = await forecastResponse.json()
    const geoData = {}

    return {
      weatherData,
      forecastData,
      geoData
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return { weatherData: null, forecastData: null, geoData: null }
  }
}
