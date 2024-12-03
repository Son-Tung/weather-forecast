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
  weather: any
  weather5day: any
  dateSelected: any
  windowWidth: any
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

const Summary: React.FC<SummaryProps> = ({ weather, weather5day, dateSelected, windowWidth }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const humidityRef = useRef<HTMLDivElement | null>(null)
  const [widthBigChart, setWidthBigChart] = useState(0)
  const [width1Line, setWidth1Line] = useState(0)
  const [humidityDisplay, setHumidityDisplay] = useState<number[]>([])
  const [hourDisplay, setHourDisplay] = useState<String[]>([])
  const [dateArray, setDateArray] = useState<Date[]>([])
  const [index, setIndex] = useState(0)
  const [loadingChart, setLoadingChart] = useState(true)

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
        backgroundColor: ''
      }
    ]
  })

  const [options] = useState({
    responsive: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false }
      },
      y: {
        grid: {
          display: false,
          drawOnChartArea: false
        },
        display: false
      }
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'line'>) {
            return `${context.dataset.label}: ${context.raw}°`
          }
        }
      },
      filler: { propagate: false }
    },
    layout: {
      padding: {
        bottom: 0 // Remove bottom padding
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
          if (index > 0 && index < 41) {
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
    let color: string

    if (temp >= 30) {
      color = 'rgba(247,149,145,255)'
    } else if (temp == 25) {
      color = 'rgba(254,243,220,255)'
    } else if (temp <= 20) {
      color = 'rgba(255,251,243,255)'
    } else {
      const startColor = { r: 255, g: 251, b: 243, a: 255 }
      const midColor = { r: 254, g: 243, b: 220, a: 255 }
      const endColor = { r: 247, g: 149, b: 145, a: 255 }

      let ratio = (temp - 25) / 5
      let r, g, b, a, r2, g2, b2, a2: number
      if (ratio < 0) {
        r2 = midColor.r - startColor.r
        g2 = midColor.g - startColor.g
        b2 = midColor.b - startColor.b
        a2 = midColor.a - startColor.a
      } else {
        r2 = endColor.r - midColor.r
        g2 = endColor.g - midColor.g
        b2 = endColor.b - midColor.b
        a2 = endColor.a - midColor.a
      }

      r = Math.round(midColor.r + ratio * r2)
      g = Math.round(midColor.g + ratio * g2)
      b = Math.round(midColor.b + ratio * b2)
      a = Math.round(midColor.a + ratio * a2)
      color = `rgba(${r},${g},${b},${a})`
    }
    return color
  }

  function getHour(epoch: number) {
    const hours = new Date(epoch * 1000).getHours()
    if (hours <= 12) {
      return `${hours} AM`
    } else {
      return `${hours - 12} PM`
    }
  }

  function getDateString(date: Date) {
    const day = String(date.getDate()).padStart(2, '0') // Lấy ngày và thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0') // Lấy tháng (tháng bắt đầu từ 0)
    const year = date.getFullYear() // Lấy năm

    const hours = String(date.getHours()).padStart(2, '0') // Lấy giờ
    const minutes = String(date.getMinutes()).padStart(2, '0') // Lấy phút

    return `${day}/${month}/${year} ${hours}:${minutes}` // Trả về chuỗi theo định dạng yêu cầu
  }

  useEffect(() => {
    if (contentRef.current) {
      let widthSummary = contentRef.current.clientWidth
      setWidthBigChart(widthSummary * 5.125)
      setWidth1Line((widthSummary * 5.125) / 41)
    }
  }, [contentRef, windowWidth])

  useEffect(() => {
    let index = 0
    for (let i = 0; i < dateArray.length; i++) {
      if (dateArray[i] > dateSelected) {
        index = i
        break
      }
    }

    setIndex(index)
  }, [dateArray, dateSelected])

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    console.log()
    if (humidityRef.current) {
      const humidityTitle = humidityRef.current as HTMLElement
      humidityTitle.style.display = 'none'

      timer = setTimeout(() => {
        humidityTitle.style.display = 'inline-block'
      }, 1000)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [dateSelected, humidityRef])

  useEffect(() => {
    setLoadingChart(false)

    // Đặt lại loadingChart thành true sau một khoảng thời gian ngắn
    const timer = setTimeout(() => {
      setLoadingChart(true)
    }, 0) // Thời gian có thể điều chỉnh

    // Dọn dẹp timer khi component unmount hoặc khi effect chạy lại
    return () => clearTimeout(timer)
  }, [widthBigChart, width1Line])

  useEffect(() => {
    let bigArray = []
    let push1time = true
    let has1small = false
    for (let i = 0; i < 40; i++) {
      if (push1time) {
        if (weather5day?.list[i]?.dt > weather?.dt) {
          bigArray.push(weather)
        } else if (!has1small) {
          has1small = true
        }
        push1time = false
      }

      bigArray.push(weather5day?.list[i])
    }

    let temperatureArray = []
    let humidityArray = []
    let dateArray = []
    let hourArrayDisplay = []

    for (let i = 0; i < bigArray.length; i++) {
      temperatureArray.push(bigArray[i]?.main?.temp)
      if ((has1small && i > 0) || (!has1small && i < 40)) {
        humidityArray.push(bigArray[i]?.main?.humidity)
      }

      dateArray.push(new Date(bigArray[i]?.dt * 1000))

      if ((has1small && i == 1) || (!has1small && i == 0)) {
        hourArrayDisplay.push('Now')
      } else {
        hourArrayDisplay.push(`${getHour(bigArray[i]?.dt)}`)
      }
    }

    if (has1small) {
      temperatureArray.push(bigArray[40]?.main?.temp)
      dateArray.push(new Date(bigArray[40]?.dt * 1000))
      hourArrayDisplay.shift()
    } else {
      temperatureArray.unshift(bigArray[0]?.main?.temp)
      dateArray.unshift(new Date(bigArray[0]?.dt * 1000))
      hourArrayDisplay.pop()
    }

    /*
    console.log('weather: '                , weather                      )
    console.log('weather5day: '            , weather5day                  )
    console.log('temperatureArray: '       , temperatureArray             )
    console.log('humidityArray: '          , humidityArray                )
    
    console.log('temperatureArray.length: ', temperatureArray.length      )
    console.log('humidityArray.length: '   , humidityArray.length         )
    
    console.log('bigArray: '               , bigArray                     )
    console.log('push1time: '              , push1time                    )
    console.log('has1small: '              , has1small                    )
    
    console.log('dateArray: '              , dateArray.map(getDateString) )
    console.log('hourArrayDisplay: '       , hourArrayDisplay             )
    console.log('dateArray.length: '       , dateArray.length             )
    console.log('hourArrayDisplay.length: ', hourArrayDisplay.length      )
    */

    const dateArrayString = dateArray.map(getDateString)

    setData({
      labels: dateArrayString,
      datasets: [
        {
          label: 'Temperature',
          borderColor: 'rgba(181,181,181,255)',
          borderWidth: 1,
          data: temperatureArray,
          pointRadius: 0,
          fill: true,
          backgroundColor: ''
        }
      ]
    })

    setHumidityDisplay(humidityArray) // Cập nhật state độ ẩm
    setHourDisplay(hourArrayDisplay) // Cập nhật state giờ hiển thị
    setDateArray(dateArray) // Cập nhật state mảng thời gian epoch để đối chiếu với ngày kích hoạt từ nút và di chuyển sơ đồ
  }, [weather, weather5day])

  return (
    <div className='summary-display' ref={contentRef}>
      <div className='chart-row'>
        {loadingChart && widthBigChart != 0 && width1Line != 0 && (
          <Line
            className='chart'
            style={{ transform: `translateX(-${(index == 0 ? 0.5 : index - 0.5) * width1Line}px)` }}
            data={data}
            options={options}
            plugins={[customPlugin]}
            width={widthBigChart} // Set width here
            height={177} // Set height
          />
        )}
      </div>

      <div className='humidity-row'>
        <span className='humidity-title' ref={humidityRef}>
          <svg width='10' height='10' viewBox='0 0 9 12' fill='black'>
            <path d='M7.91602 6.83203C8.02539 7.05469 8.10742 7.28516 8.16211 7.52344C8.2207 7.76172 8.25 8.00391 8.25 8.25C8.25 8.59375 8.20508 8.92578 8.11523 9.24609C8.02539 9.56641 7.89844 9.86523 7.73438 10.1426C7.57422 10.4199 7.37891 10.6738 7.14844 10.9043C6.92188 11.1309 6.66992 11.3262 6.39258 11.4902C6.11523 11.6504 5.81641 11.7754 5.49609 11.8652C5.17578 11.9551 4.84375 12 4.5 12C4.15625 12 3.82422 11.9551 3.50391 11.8652C3.18359 11.7754 2.88477 11.6504 2.60742 11.4902C2.33008 11.3262 2.07617 11.1309 1.8457 10.9043C1.61914 10.6738 1.42383 10.4199 1.25977 10.1426C1.09961 9.86523 0.974609 9.56641 0.884766 9.24609C0.794922 8.92578 0.75 8.59375 0.75 8.25C0.75 8.00391 0.777344 7.76172 0.832031 7.52344C0.890625 7.28516 0.974609 7.05469 1.08398 6.83203L4.5 0L7.91602 6.83203Z'></path>
          </svg>{' '}
        </span>
        <div
          className='humidity-array'
          style={{ transform: `translateX(-${(index <= 1 ? 0 : index - 1) * width1Line}px)` }}
        >
          {humidityDisplay.length > 0 &&
            humidityDisplay.map((humidity, index) => (
              <span key={index} className='humidity-text'>{`${humidity}%`}</span>
            ))}
        </div>
      </div>

      <div className='hour-row'>
        <div
          className='hour-row-container'
          style={{ transform: `translateX(-${(index <= 1 ? 0 : index - 1) * width1Line}px)` }}
        >
          {hourDisplay.length > 0 &&
            hourDisplay.map((hour, index) => (
              <span key={index} className='hour-text'>
                {hour}
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Summary
