import React, { useEffect, useState } from 'react'

interface WeatherAlertProps {
  city: string
  weather: CurrentWeather | null
  weather5Day: { list: Forecast[] } | null
}

interface CurrentWeather {
  dt: number
  main: {
    temp: number
  }
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

const WeatherAlert: React.FC<WeatherAlertProps> = ({ city, weather, weather5Day }) => {
  const [alert, setAlert] = useState<string>('')

  const getAlertType = (forecast: Forecast) => {
    const conditions = [
      { condition: forecast?.main?.humidity > 80, alert: 'High Humidity' },
      { condition: forecast?.wind?.speed > 10, alert: 'Strong Wind' },
      { condition: forecast?.weather[0]?.main === 'Rain', alert: 'Rain' },
      { condition: forecast?.weather[0]?.main === 'Snow', alert: 'Snow' },
      { condition: forecast?.weather[0]?.main === 'Thunderstorm', alert: 'Thunderstorm' },
      { condition: forecast?.weather[0]?.main === 'Fog', alert: 'Fog' },
      { condition: forecast?.main?.temp > 35, alert: 'Extreme Heat' },
      { condition: forecast?.main?.temp < 0, alert: 'Extreme Cold' },
      { condition: forecast?.weather[0]?.main === 'Extreme', alert: 'Extreme Weather' },
      { condition: forecast?.weather[0]?.main === 'Drizzle', alert: 'Drizzle' },
      { condition: forecast?.weather[0]?.main === 'Mist', alert: 'Mist' },
      { condition: forecast?.main?.temp > 30, alert: 'Hot' },
      { condition: forecast?.main?.temp < 15, alert: 'Cold' },
      { condition: forecast?.weather[0]?.description.includes('heavy rain'), alert: 'Heavy Rain' },
      { condition: forecast?.weather[0]?.main === 'Hurricane', alert: 'Hurricane' },
      { condition: forecast?.wind?.speed > 15, alert: 'Very Strong Wind' },
      { condition: forecast?.main?.temp > 15 && forecast?.main?.temp < 30, alert: 'Normal Temperature' }
    ]

    for (const { condition, alert } of conditions) {
      if (condition) return alert
    }
    return null
  }

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (!weather || !weather5Day || !weather5Day?.list) {
          setAlert(`City not found: ${city}`)
          return
        }

        const currentWeather = weather
        const forecastList = weather5Day?.list

        const currentTime = currentWeather?.dt * 1000
        const endTime = currentTime + 24 * 60 * 60 * 1000

        const currentAlert = getAlertType({
          dt: currentWeather?.dt,
          main: { temp: currentWeather?.main?.temp, humidity: 50 },
          wind: { speed: 5 },
          weather: currentWeather?.weather
        })

        const futureAlerts = forecastList
          .filter((forecast) => forecast?.dt * 1000 <= endTime)
          .map((forecast) => ({ ...forecast, alertType: getAlertType(forecast) }))
          .filter((forecast) => forecast?.alertType && forecast?.alertType !== currentAlert)

        let alertMessage = `${city}:  ${currentAlert || currentWeather?.weather[0]?.description}`

        if (futureAlerts?.length > 0) {
          futureAlerts.sort((a, b) => a.dt - b.dt)
          const nearestAlert = futureAlerts[0]
          const alertTime = nearestAlert?.dt * 1000
          const hoursUntilAlert = Math.round((alertTime - currentTime) / (1000 * 60 * 60))
          alertMessage += `. In ${hoursUntilAlert} hours,it wil be ${nearestAlert?.alertType}`
        }

        setAlert(alertMessage)
      } catch (error) {
        console.error('Error processing weather data:', error)
      }
    }

    fetchWeatherData()
  }, [city, weather, weather5Day])

  return <div className='alert'>{alert && <p>{alert}</p>}</div>
}

export default WeatherAlert
