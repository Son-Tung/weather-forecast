import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface WeatherAlertProps {
  city: string
}

interface CurrentWeather {
  dt: number

  weather: {
    main: string
    description: string
  }[]
}

interface Forecast {
  dt: number
  main: {
    temp: number
    humidity: number
  }
  wind: {
    speed: number
  }
  weather: {
    main: string
    description: string
  }[]
}

const WeatherAlert: React.FC<WeatherAlertProps> = ({ city }) => {
  const apiKey = '4f2141f03c148886930241854489683e'
  const [alert, setAlert] = useState<string>('')
  const [, setCurrentWeather] = useState<CurrentWeather | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const currentWeatherResponse = await axios.get<CurrentWeather>(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        )
        const currentWeather = currentWeatherResponse.data
        setCurrentWeather(currentWeather)

        const forecastResponse = await axios.get<{ list: Forecast[] }>(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        )
        const forecastList = forecastResponse.data.list

        const alerts = forecastList.filter(
          (forecast) =>
            forecast.main.temp > 30 ||
            forecast.main.temp < 0 ||
            forecast.main.humidity > 80 ||
            forecast.wind.speed > 10 ||
            forecast.weather[0].main === 'Rain' ||
            forecast.weather[0].main === 'Snow' ||
            forecast.weather[0].main === 'Thunderstorm'
        )

        if (alerts.length > 0) {
          alerts.sort((a, b) => a.dt - b.dt)
          const nearestAlert = alerts[0]
          const currentTime = currentWeather.dt * 1000
          const alertTime = nearestAlert.dt * 1000
          const hoursUntilAlert = Math.round((alertTime - currentTime) / (1000 * 60 * 60))
          setAlert(` ${city}: ${hoursUntilAlert} hours to ${nearestAlert.weather[0].description}`)
        } else {
          setAlert(`There are no weather warnings for ${city} in the next 24 hours.`)
        }
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    fetchWeatherData()
  }, [city, apiKey])

  return <div className='alert'>{alert && <p>{alert}</p>}</div>
}

export default WeatherAlert
