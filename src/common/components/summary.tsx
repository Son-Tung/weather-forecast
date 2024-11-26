import React, { useState, useEffect, useRef } from 'react'
import '../styles/summary.css'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Chart,
  TooltipItem
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface SummaryProps {
  selectedWeather: any[]
  weather: any
  weather5day: any
}

interface DataState {
  labels: string[]
  datasets: {
    label: string
    borderColor: string
    borderWidth: number
    data: number[]
    pointRadius: number
    fill: boolean | string
    backgroundColor: CanvasGradient | string
  }[]
}

const Summary: React.FC<SummaryProps> = ({ selectedWeather, weather, weather5day }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)

  const [data, setData] = useState<DataState>({
    labels: [],
    datasets: [
      {
        label: 'Temperature',
        borderColor: 'rgba(181,181,181,255)',
        borderWidth: 1,
        data: [],
        pointRadius: 0,
        fill: true,
        backgroundColor: '',
      }
    ]
  })

  const [humidityData, setHumidityData] = useState<number[]>([])

  const [options] = useState({
    responsive: false,
    scales: {
      x: {
        grid: {
          display: false // Hide x-axis grid lines
        },
        ticks: { 
          display: false
        } // Ẩn nhãn giờ trên trục x
      },
      y: {
        grid: {
          display: false // Hide y-axis grid lines
        },
        display: false // Hide y-axis
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false // Hide title
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'line'>) {
            return `${context.dataset.label}: ${context.raw}°`
          }
        }
      },
      filler: {
        propagate: false
      }
    }
  })

  
  const customPlugin = {
    id: 'customDataLabels',
    afterDatasetsDraw: (chart: Chart) => {
      const ctx = chart.ctx
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i)
        meta.data.forEach((point: any, index: number) => {
          if (index !== 0) {
            const value = dataset.data[index] as number
            ctx.save()
            ctx.font = '12px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.fillStyle = 'black'
            ctx.fillText(`${value}°`, point.x, point.y - 3)
            ctx.restore()
          }
        })
      })
    },
    beforeDatasetsUpdate: (chart: Chart) => {
      const ctx = chart.ctx
      const dataset = chart.data.datasets[0]
      const gradient = ctx.createLinearGradient(0, 0, 0, chart.height)

      // Find the highest temperature in the dataset
      const validData = dataset.data.filter((value) => value !== null) as number[]
      const maxTemp = Math.max(...validData)
      const minTemp = Math.min(...validData)

      gradient.addColorStop(0, getColor(maxTemp)) // Top color    highest to 'rgba(247,149,145,255)' with 40°C

      if (minTemp < 30 && maxTemp > 30) {
        gradient.addColorStop((maxTemp - 30) / (maxTemp - minTemp), 'rgba(247,149,145,255)') 
      }

      if (minTemp < 25 && maxTemp > 25) {
        gradient.addColorStop((maxTemp - 25) / (maxTemp - minTemp), 'rgba(254,243,220,255)') 
      }

      if (minTemp < 20 && maxTemp > 20) {
        gradient.addColorStop((maxTemp - 20) / (maxTemp - minTemp), 'rgba(255,251,243,255)') 
      }

      gradient.addColorStop(1, getColor(minTemp)) // Bottom color rgba(255,251,243,255)
      dataset.backgroundColor = gradient
    }
  }

  function getColor(temp: number) {
    let color: string;

    if      (temp >= 30) { color = 'rgba(247,149,145,255)'; }
    else if (temp == 25) { color = 'rgba(254,243,220,255)'; }
    else if (temp <= 20) { color = 'rgba(255,251,243,255)'; }

    else {
      const startColor = { r: 255, g: 251, b: 243, a: 255 }
      const midColor   = { r: 254, g: 243, b: 220, a: 255 }
      const endColor   = { r: 247, g: 149, b: 145, a: 255 }

      let ratio = (temp - 25) / 5  
      let r, g, b, a, r2, g2, b2, a2: number;
      if (ratio < 0) {
        r2 = midColor.r - startColor.r
        g2 = midColor.g - startColor.g
        b2 = midColor.b - startColor.b
        a2 = midColor.a - startColor.a
      }

      else {
        r2 = endColor.r - midColor.r
        g2 = endColor.g - midColor.g
        b2 = endColor.b - midColor.b
        a2 = endColor.a - midColor.a
      }

      r = Math.round(midColor.r + ratio * r2)
      g = Math.round(midColor.g + ratio * g2)
      b = Math.round(midColor.b + ratio * b2)
      a = Math.round(midColor.a + ratio * a2)
      color = `rgba(${r},${g},${b},${a})`;
    }
    return color;
  }

  useEffect(() => {
    let bigArray = []
    let push1time = true;
    let has1small = false;
    let positionWeather;
    for (let i = 0; i < 40; i++) {
      if (push1time) {
        if (weather5day?.list[i]?.dt > weather?.dt) {
          positionWeather = i;
          bigArray.push(weather)
        }

        else if (!has1small) {
          has1small = true;
        }
        push1time = false
      }

      bigArray.push(weather5day?.list[i])
    }
    
    let temperatureArray = []
    let humidityArray = []
    let hourArray = []

    if (!has1small) {
      temperatureArray.push(bigArray[0]?.main?.temp)
      humidityArray.push(bigArray[0]?.main?.humidity)
      hourArray.push(`${(new Date(bigArray[1]?.dt * 1000).getHours() - 3).toString().padStart(2, '0')}:00`)
    }

    for (let i = 0; i < bigArray.length; i++) {
      temperatureArray.push(bigArray[i]?.main?.temp)
      humidityArray.push(bigArray[i]?.main?.humidity)
      
      if (i == positionWeather) {

      }

      else {

      }
      
      hourArray.push(`${new Date(bigArray[i]?.dt * 1000).getHours().toString().padStart(2, '0')}:${new Date(bigArray[i]?.dt * 1000).getMinutes().toString().padStart(2, '0')}`)
    }

    console.log('positionWeather: ', positionWeather)
    console.log('selectedWeather: ', selectedWeather)
    console.log('weather: ', weather)
    console.log('weather5day: ', weather5day)
    console.log('temperatureArray: ', temperatureArray)
    console.log('humidityArray: '   , humidityArray   )
    console.log('hourArray: '       , hourArray       )
    console.log('temperatureArray.length: ', temperatureArray.length)
    console.log('humidityArray.length: '   , humidityArray.length   )
    console.log('hourArray.length: '       , hourArray.length       )
    console.log('bigArray: ' , bigArray )
    console.log('push1time: ', push1time)
    console.log('has1small: ', has1small)


    setData({
      labels: hourArray,
      datasets: [
        {
          label: 'Temperature',
          borderColor: 'rgba(181,181,181,255)',
          borderWidth: 1,
          data: temperatureArray,
          pointRadius: 0,
          fill: true,
          backgroundColor: '',
        }
      ]
    })

    setHumidityData(humidityArray) // Cập nhật state độ ẩm
  }, [selectedWeather, weather, weather5day])

  return (
    <div className='summary-display' ref={contentRef}>
      {data != null && options != null && (
        <>
          <Line
            data={data}
            options={options}
            plugins={[customPlugin]}
            width={window.innerWidth * 4} // Set width here
            height={228} // Set height
          />

          <div className='humidity-row'>
            {humidityData.map((humidity, index) => (
              <span key={index} className='humidity-text'>{`${humidity}%`}</span>
            ))}
          </div>

          <div className='hour-labels'> 
            {data.labels.map((label, index) => ( 
              <span key={index} className='hour-text'>{label}</span> 
            ))} 
          </div>
        </>
      )}
    </div>
  )
}

export default Summary
