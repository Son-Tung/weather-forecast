import React, { useState, useEffect, useRef } from 'react'
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
  Chart,
  TooltipItem
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface SummaryProps {
  selectedWeather: any[]
  weather: any
  weather5day: any
}

interface DataState {
  labels: string[]
  datasets: {
    label: 'Temperature'
    borderColor: string
    borderWidth: number
    data: number[]
    pointRadius: number
  }[]
}

const Summary: React.FC<SummaryProps> = ({ selectedWeather, weather, weather5day }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(window.innerWidth)

  const [data, setData] = useState<DataState>({
    labels: [],
    datasets: [
      {
        label: 'Temperature',
        borderColor: 'rgba(181,181,181,255)',
        borderWidth: 1,
        data: [],
        pointRadius: 0
      }
    ]
  })

  const customPlugin = {
    id: 'customDataLabels',
    afterDatasetsDraw: (chart: Chart) => {
      const ctx = chart.ctx
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i)
        meta.data.forEach((point: any, index: number) => {
          const value = dataset.data[index] as number
          ctx.save()
          ctx.font = '12px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'
          ctx.fillStyle = 'black'
          ctx.fillText(`${value}°`, point.x, point.y - 8)
          ctx.restore()
        })
      })
    }
  }

  const [options] = useState({
    responsive: false,
    scales: {
      x: {
        grid: {
          display: false // Hide x-axis grid lines
        }
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
      }
    }
  })

  useEffect(() => {
    if (contentRef.current) {
      setWidth(contentRef.current.offsetWidth)
    }

    let bigArray = []
    bigArray.push(weather)
    for (let i = 0; i < 40; i++) {
      if (weather5day?.list[i]?.dt > weather?.dt) {
        bigArray.push(weather5day?.list[i])
      }
    }

    let temperatureArray = []
    let humidityArray = []
    let hourArray = []

    for (let i = 0; i < bigArray.length; i++) {
      temperatureArray.push(bigArray[i]?.main?.temp)
      humidityArray.push(bigArray[i]?.main?.humidity)
      hourArray.push(`${new Date(bigArray[i]?.dt * 1000).getHours().toString()}:00`)
    }

    setData({
      labels: hourArray,
      datasets: [
        {
          label: 'Temperature',
          borderColor: 'rgba(181,181,181,255)',
          borderWidth: 1,
          data: temperatureArray,
          pointRadius: 0
        }
      ]
    })
  }, [selectedWeather, weather, weather5day])

  return (
    <div className='summary-display' ref={contentRef}>
      {data != null && options != null && (
        <Line
          data={data}
          options={options}
          plugins={[customPlugin]}
          width={width} // Set width here
          height={600} // Set height
        />
      )}
    </div>
  )
}

export default Summary
