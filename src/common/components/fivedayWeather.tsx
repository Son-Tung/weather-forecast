import React, { useState, useEffect, useRef } from 'react'
import { weatherImages } from './weatherImages'
import '../styles/FiveWeather.scss'

interface FivedayWeatherProps {
  weather: any
  weather5day: any
  windowWidth: any
  onItemSelected: (date: any, weather: any, weather5day: any) => void
}

const FivedayWeather: React.FC<FivedayWeatherProps> = ({ weather, weather5day, windowWidth, onItemSelected }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(0)
  const [selectedButton, setSelectedButton] = useState<number[]>([365, 182.5, 182.5, 182.5, 182.5])
  const [translateX, settranslateX] = useState(0)
  const [itemSelectedIdx, setItemSelectedIdx] = useState(0)

  useEffect(() => {
    setCurrentSlide(0)
  }, [windowWidth])

  useEffect(() => {
    if (contentRef.current) {
      const gridContainer = document.querySelector('.five-content') as HTMLElement // five
      gridContainer.style.display = 'grid'
      let width5button = contentRef.current.clientWidth
      if (width5button != width) {
        setWidth(width5button)
      }

      let calculatedNumColumn
      if (width5button >= 1111) {
        gridContainer.style.gridTemplateColumns = `${getGridString()}`
        gridContainer.style.columnGap = `${(4 / 1116) * 100}%`
        calculatedNumColumn = 5
        settranslateX(0)
      } else {
        let widthCount = -4
        let buttonArray = []
        let slideStart = getSameVariable(currentSlide)
        let slideNow = getSameVariable(slideStart)
        let increase = true

        while (widthCount + selectedButton[slideNow] + 4 <= width5button) {
          if (slideNow === 5) {
            slideNow = slideStart - 1
            increase = false
          }
          if (increase) {
            buttonArray.push(selectedButton[slideNow])
            widthCount += selectedButton[slideNow] + 4
            slideNow++
          } else {
            buttonArray.unshift(selectedButton[slideNow])
            widthCount += selectedButton[slideNow] + 4
            slideNow--
          }
        }

        let responsiveRate = width5button / widthCount
        let columnGap = 4 * responsiveRate
        calculatedNumColumn = buttonArray.length

        let translate = 0
        if (currentSlide != 0) {
          translate = -4
          for (let i = 0; i < currentSlide; i++) {
            translate += selectedButton[i] + 4
          }
          translate *= responsiveRate
        }

        gridContainer.style.gridTemplateColumns = `${getGridString2(selectedButton, responsiveRate, selectedButton.length)}`
        gridContainer.style.columnGap = `${columnGap}px`
        if (translateX !== translate) {
          settranslateX(translate)
        }
      }

      if (calculatedNumColumn !== slidesToShow) {
        setSlidesToShow(calculatedNumColumn)
      }
    }
  }, [windowWidth, selectedButton, contentRef, currentSlide])

  function nextSlide() {
    setCurrentSlide(function (prevSlide) {
      let slideCount = prevSlide + slidesToShow
      if (slideCount > 5 - slidesToShow) {
        return 5 - slidesToShow
      } else {
        return slideCount
      }
    })
  }

  function prevSlide() {
    setCurrentSlide(function (prevSlide) {
      let slideCount = prevSlide - slidesToShow
      if (slideCount < 0) {
        return 0
      } else {
        return slideCount
      }
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
    return JSON.parse(JSON.stringify(variable))
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
  }, [currentSlide, slidesToShow, width])

  const groupedByDay = weather5day?.list?.reduce((acc: any, curr: any) => {
    const dateObj = new Date(curr.dt * 1000)
    const day = dateObj.getDate()
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    const date = `${day} ${weekday}`

    const hour = dateObj.getHours()

    if (hour >= 0 && hour <= 21) {
      if (!acc[date]) {
        acc[date] = {
          temp_max: curr.main.temp_max,
          temp_min: curr.main.temp_min,
          weather: curr.weather[0],
          humidity: curr.main.humidity,
          date: dateObj,
          displayDate: day === 1 ? `${month} ${day} ${weekday}` : `${day} ${weekday}`
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

  function handleItemClick(index: number, dateGMT: any, weather: any, weather5day: any) {
    if (itemSelectedIdx != index) {
      const newState = [182.5, 182.5, 182.5, 182.5, 182.5]
      newState[index] = 365
      setSelectedButton(newState)
      setItemSelectedIdx(index)
    }
    onItemSelected(dateGMT, weather, weather5day)
  }

  useEffect(() => {
    if (groupedByDay && days.length > 0) {
      onItemSelected(groupedByDay[days[0]]?.date, weather, weather5day)
    }
  }, [weather, weather5day])

  return (
    <div className='fiveday' ref={contentRef}>
      <div className='fivetitle'>
        <h4>Five day weather forecast</h4>
      </div>
      <div className='five-container'>
        <div className='five-content' style={{ transform: `translateX(-${translateX}px)` }}>
          {days.slice(0, 5).map((day, index) => {
            const dayData = groupedByDay[day]
            let dateGMT = groupedByDay[day]?.date
            let description = dayData?.weather?.description
            let capitalizedDescription = description ? description.charAt(0).toUpperCase() + description.slice(1) : ''

            return (
              <div
                key={index}
                aria-label={`Dự báo thời tiết cho ${day}`}
                className={`${itemSelectedIdx === index ? 'activeCard' : ''} five-item`}
                onClick={() => handleItemClick(index, dateGMT, weather, weather5day)}
              >
                <p className='current-time'>{index === 0 ? 'Today' : dayData.displayDate}</p>
                <div className='current-description'>
                  <div className='left'>
                    <img
                      src={weatherImages[dayData?.weather?.main.toLowerCase()] || weatherImages.default}
                      alt={dayData?.weather?.description}
                      className='weather-image'
                    />
                    <div className='temp-info'>
                      <p>{Math.ceil(dayData?.temp_max)}°</p>
                      <p>{Math.ceil(dayData?.temp_min)}°</p>
                    </div>
                  </div>
                  <div className='right'>
                    <p>{capitalizedDescription}</p>
                    <p>{Math.ceil(dayData?.humidity)}%</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
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

/*
useEffect(() => {
  console.log('width: ', width)
}, [width])

useEffect(() => {
  console.log('slidesToShow: ', slidesToShow)
}, [slidesToShow])

useEffect(() => {
  console.log('itemSelectedIdx: ', itemSelectedIdx)
}, [itemSelectedIdx])

useEffect(() => {
  console.log('windowWidth: ', windowWidth)
  setCurrentSlide(0)
}, [windowWidth])

useEffect(() => {
  console.log('currentSlide: ', currentSlide)
}, [currentSlide])

useEffect(() => {
  console.log('translateX: ', translateX)
}, [translateX])

useEffect(() => {
  console.log('selectedButton: ', selectedButton)
}, [selectedButton])

useEffect(() => {
  console.log('every check console: ')
}, [windowWidth, selectedButton, currentSlide, slidesToShow, width, itemSelectedIdx, translateX])
*/
