import React, { useState, useEffect, useRef, useCallback } from 'react'
import { weatherImages } from '../../assets/images/weatherImages'
import '../styles/FiveWeather.scss'

interface FivedayWeatherProps {
  weather: any
  weather5day: any
  onItemSelected: (date: any, weather: any, weather5day: any) => void
}

const FivedayWeather: React.FC<FivedayWeatherProps> = ({ weather, weather5day, onItemSelected }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(0)
  const [selectedButton, setSelectedButton] = useState<number[]>([300, 200, 200, 200, 200])
  const [responsiveRate, setResponsiveRate] = useState(1)
  const [translateX, settranslateX] = useState(0)

  useEffect(() => {
    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow) // Thêm event listener
    return () => {
      window.removeEventListener('resize', updateSlidesToShow) // Bỏ đăng ký khi component unmount
    }
  }, [updateSlidesToShow])

  function updateSlidesToShow() {
    if (contentRef.current) {
      const gridContainer = document.querySelector('.five') as HTMLElement
      gridContainer.style.display = 'grid'
      let width = contentRef.current.clientWidth // Lấy chiều rộng của contentRef
      setWidth(width)

      let calculatedNumColumn
      if (width >= 1116) {
        gridContainer.style.gridTemplateColumns = `${getGridString()}`
        gridContainer.style.columnGap = `${(4 / 1116) * 100}%` // Khoảng cách giữa các cột
        calculatedNumColumn = 5
      } else {
        let widthCount = -4
        let buttonArray = []
        let slideStart = getSameVariable(currentSlide)
        let slideNow = getSameVariable(slideStart)

        while (widthCount + selectedButton[slideNow] + 4 <= width) {
          widthCount += selectedButton[slideNow] + 4
          buttonArray.push(selectedButton[slideNow])
          slideNow++
        }

        let reponsiveRate = width / widthCount
        setResponsiveRate(reponsiveRate)
        let columnGap = 4 * reponsiveRate

        gridContainer.style.gridTemplateColumns = `${getGridString2(selectedButton, reponsiveRate, selectedButton.length)}`
        gridContainer.style.columnGap = `${columnGap}px`
        calculatedNumColumn = buttonArray.length
      }

      if (calculatedNumColumn !== slidesToShow) {
        setSlidesToShow(calculatedNumColumn)
      }
      console.log('slidesToShow: ', calculatedNumColumn)
      settranslateX(getTranslateX(selectedButton, currentSlide, responsiveRate))
    }
  }

  function nextSlide() {
    setCurrentSlide(function (prevSlide) {
      let slideCount = prevSlide + slidesToShow
      if (slideCount > 5 - slidesToShow) {
        console.log('currentSlide:', 5 - slidesToShow)
        return 5 - slidesToShow
      } else {
        console.log('currentSlide:', slideCount)
        return slideCount
      }
    })
  }

  function prevSlide() {
    setCurrentSlide(function (prevSlide) {
      let slideCount = prevSlide - slidesToShow
      if (slideCount < 0) {
        console.log('currentSlide:', 0)
        return 0
      } else {
        console.log('currentSlide:', slideCount)
        return slideCount
      }
    })
  }

  const updateElementAtIndex = (index: number) => {
    setSelectedButton(() => {
      const newState = [200, 200, 200, 200, 200] // Create a new array
      newState[index] = 300 // Update the element at the specified index
      return newState
    })
  }

  function getGridString() {
    let gridString = ''
    for (let i = 0; i < 5; i++) {
      gridString += `${(selectedButton[i] / 1116) * 100}% `
    }
    return gridString
  }

  function getGridString2(buttonArray: Array<number>, reponsiveRate: number, columnCount: number) {
    let gridString = ''
    for (let i = 0; i < columnCount; i++) {
      gridString += `${buttonArray[i] * reponsiveRate}px `
    }
    return gridString
  }

  function getSameVariable(variable: any) {
    return variable
  }

  const getTranslateX = (selectedButton: any, currentSlide: number, reponsiveRate: number) => {
    console.log(selectedButton, currentSlide, reponsiveRate)
    let translateX = -4
    if (currentSlide == 0) {
      console.log(0)
      return 0
    } else {
      for (let i = 0; i < currentSlide; i++) {
        translateX += selectedButton[i] + 4
      }
      console.log(translateX)
      translateX *= reponsiveRate
      return translateX
    }
  }

  useEffect(() => {
    const leftButton = document.querySelector<HTMLElement>('.five-day-button-left')
    const rightButton = document.querySelector<HTMLElement>('.five-day-button-right')

    const updateButtonDisplay = (leftDisplay: string, rightDisplay: string) => {
      if (leftButton) leftButton.style.display = leftDisplay
      if (rightButton) rightButton.style.display = rightDisplay
    }

    if (width >= 1116) {
      updateButtonDisplay('none', 'none')
    } else {
      if (currentSlide === 0) {
        updateButtonDisplay('none', 'block')
      } else if (currentSlide === 5 - slidesToShow) {
        updateButtonDisplay('block', 'none')
      } else {
        updateButtonDisplay('block', 'block')
      }
    }
  }, [currentSlide, slidesToShow, width]) // Theo dõi sự thay đổi của currentSlide và slidesToShow

  const groupedByDay = weather5day?.list?.reduce((acc: any, curr: any) => {
    const date = new Date(curr.dt * 1000).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric'
    })
    const hour = new Date(curr.dt * 1000).getHours()
    if (hour >= 0 && hour <= 21) {
      if (!acc[date]) {
        acc[date] = {
          temp_max: curr.main.temp_max,
          temp_min: curr.main.temp_min,
          weather: curr.weather[0],
          humidity: curr.main.humidity,
          date: new Date(curr.dt * 1000)
        }
      } else {
        acc[date].temp_max = Math.max(acc[date].temp_max, curr.main.temp_max)
        acc[date].temp_min = Math.min(acc[date].temp_min, curr.main.temp_min)
        acc[date].humidity = Math.max(acc[date].humidity, curr.main.humidity)
      }
    }
    return acc
  }, {})

  const days = Object.keys(groupedByDay || {})
  console.log('weather5day === ', groupedByDay)
  const handleItemClick = useCallback(
    (
      index: number,
      listItems: NodeListOf<HTMLLIElement>,
      days: any,
      groupedByDay: any,
      weather: any,
      weather5day: any
    ) => {
      listItems.forEach((item, idx) => {
        if (idx !== index) {
          item.classList.add('compact')
          item.style.background = 'rgb(239 242 247)'
          item.style.color = '#000000'
        } else {
          item.classList.remove('compact')
          item.style.background = '#ffffff'
        }
        item.style.width = '100%'
      })
      updateElementAtIndex(index)

      onItemSelected(groupedByDay[days[index]]?.date, weather, weather5day)
    },
    []
  )

  useEffect(() => {
    const listItems = document.querySelectorAll<HTMLLIElement>('.five li')
    listItems.forEach((li, index) => {
      if (index !== 0) {
        li.classList.add('compact')
        li.style.background = 'rgb(239 242 247)'
        li.style.color = '#000000'
      } else {
        li.style.background = '#ffffff'

        onItemSelected(groupedByDay[days[index]]?.date, weather, weather5day)
      }
      li.style.width = '100%'
      li.addEventListener('click', () => handleItemClick(index, listItems, days, groupedByDay, weather, weather5day))
    })
  }, [weather, weather5day, handleItemClick])

  if (!weather || !weather5day || !weather5day?.list) {
    return <p>Vui lòng tìm kiếm một địa điểm để hiển thị thông tin thời tiết.</p>
  }

  return (
    <div className='fiveday' ref={contentRef}>
      <div className='fivetitle'>
        <h4>Dự báo 5 ngày tới</h4>
        <button>XEM THEO THÁNG</button>
      </div>

      <div className='five-container'>
        <ul className='five' style={{ transform: `translateX(-${translateX}px)` }}>
          {days.slice(0, 5).map((day, index) => {
            const dayData = groupedByDay[day]
            return (
              <li key={index} aria-label={`Weather forecast for ${day}`}>
                <p>{day}</p>
                <p>{dayData?.temp_max}°C</p>
                <p>{dayData?.weather?.description}</p>
                <img
                  src={weatherImages[dayData?.weather?.main.toLowerCase()] || weatherImages.default}
                  alt={dayData?.weather?.description}
                  className='weather-image'
                />
                <p>{dayData?.temp_min}°C</p>
                <p>{dayData?.humidity}%</p>
              </li>
            )
          })}
        </ul>

        <button className='five-day-button-left' onClick={prevSlide}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            style={{ transform: 'rotate(180deg)' }}
          >
            <path
              d='M7.57107 11.8403C6.90803 12.2987 6 11.8271 6 11.0244V4.97557C6 4.17283 6.90803 3.70129 7.57106 4.1597L11.3555 6.77618C12.2133 7.3693 12.2134 8.63066 11.3555 9.22378L7.57107 11.8403Z'
              fill='#1A1A1A'
            ></path>
          </svg>
        </button>

        <button className='five-day-button-right' onClick={nextSlide}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path
              d='M7.57107 11.8403C6.90803 12.2987 6 11.8271 6 11.0244V4.97557C6 4.17283 6.90803 3.70129 7.57106 4.1597L11.3555 6.77618C12.2133 7.3693 12.2134 8.63066 11.3555 9.22378L7.57107 11.8403Z'
              fill='#1A1A1A'
            ></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FivedayWeather
