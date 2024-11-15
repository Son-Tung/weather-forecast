import '../styles/hourly.css'
import React, { useState, useEffect } from 'react'

interface HourlyProps {
  selectedWeather: any[]
  contentRef: any
}

const Hourly: React.FC<HourlyProps> = ({ selectedWeather, contentRef }) => {
  const [width, setWidth] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(0)
  const [numColumn, setNumColumn] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setCurrentSlide(0) // Reset về 0 để tránh gặp lỗi
    let numColumn = selectedWeather.length
    setNumColumn(numColumn)

    if (contentRef.current) {
      const gridContainer = document.querySelector('.every-hour-display-container') as HTMLElement
      gridContainer.style.display = 'grid'
      let width = contentRef.current.clientWidth // Lấy chiều rộng của contentRef
      setWidth(width)
      let calculatedNumColumn

      let tempWidth = 118 * numColumn - 4
      if (width >= tempWidth) {
        gridContainer.style.gridTemplateColumns = `repeat(${numColumn}, ${(114 / tempWidth) * 100}%)` // 9 cột, mỗi cột 114px
        gridContainer.style.columnGap = `${(4 / tempWidth) * 100}%` // Khoảng cách giữa các cột
        calculatedNumColumn = numColumn
      } else {
        let columnCount = Math.floor((width + 4) / 118)
        let tempWidth2 = 118 * columnCount - 4
        let reponsiveRate = width / tempWidth2

        let columnGap = 4 * reponsiveRate
        let columnWidth = 114 * reponsiveRate

        gridContainer.style.gridTemplateColumns = `repeat(${numColumn}, ${columnWidth}px)`
        gridContainer.style.columnGap = `${columnGap}px`
        calculatedNumColumn = columnCount
      }

      if (calculatedNumColumn !== slidesToShow) {
        setSlidesToShow(calculatedNumColumn)
      }
    }
  }, [windowWidth, selectedWeather.length])

  useEffect(() => {
    const leftButton = document.querySelector<HTMLElement>('.every-hour-display-button-left')
    const rightButton = document.querySelector<HTMLElement>('.every-hour-display-button-right')

    const updateButtonDisplay = (leftDisplay: string, rightDisplay: string) => {
      if (leftButton) leftButton.style.display = leftDisplay
      if (rightButton) rightButton.style.display = rightDisplay
    }

    if (width >= 118 * numColumn - 4) {
      updateButtonDisplay('none', 'none')
    } else {
      if (currentSlide === 0) {
        updateButtonDisplay('none', 'block')
      } else if (currentSlide === numColumn - slidesToShow) {
        updateButtonDisplay('block', 'none')
      } else {
        updateButtonDisplay('block', 'block')
      }
    }
  }, [currentSlide, slidesToShow, numColumn, width]) // Theo dõi sự thay đổi của currentSlide và slidesToShow

  function nextSlide() {
    setCurrentSlide(function (prevSlide) {
      let slideCount = prevSlide + slidesToShow
      if (slideCount > numColumn - slidesToShow) {
        return numColumn - slidesToShow
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

  function convertLinkImg(iconCode: string) {
    switch (iconCode) {
      case '01d':
      case '01n':
        return 'src/assets/images/Sunny.png'
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04n':
      case '04d':
        return 'src/assets/images/Cloudy.png'
      default:
        return 'src/assets/images/Rain.png'
    }
  }

  function convertSpeed(speed: number) {
    return Math.round(speed * 36) / 10
  }

  function getHour(epoch: number) {
    const date = new Date(epoch * 1000)
    const hours = date.getHours() // Đảm bảo có 2 chữ số

    if (hours <= 12) {
      return `${hours} AM`
    } else {
      return `${hours - 12} PM`
    }
  }

  function getDate(epoch: number) {
    const date = new Date(epoch * 1000)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const day = date.getDate()
    const hour = date.getHours()

    // Kiểm tra nếu giờ là 0 (nửa đêm)
    if (hour === 1) {
      return `${month} ${day}`
    } else {
      return ''
    }
  }

  return (
    <>
      <div className='every-hour-display'>
        <div
          className='every-hour-display-container'
          style={{ transform: `translateX(-${(currentSlide * 100) / slidesToShow}%)` }}
        >
          {selectedWeather.length === 9 && (
            <div className='column-hour'>
              <div className='weather'>
                <div className='day'>Today</div>
                <img
                  className='weather-icon'
                  src={convertLinkImg(selectedWeather[0]?.weather[0]?.icon)}
                  alt='weather-icon'
                />

                <div className='temperature'>{selectedWeather[0]?.main?.temp}°</div>
                <div className='weather-status'>{selectedWeather[0]?.weather[0]?.main}</div>

                <div className='bottom-card'>
                  <svg width='10' height='10' viewBox='0 0 9 12' fill='black'>
                    <path d='M7.91602 6.83203C8.02539 7.05469 8.10742 7.28516 8.16211 7.52344C8.2207 7.76172 8.25 8.00391 8.25 8.25C8.25 8.59375 8.20508 8.92578 8.11523 9.24609C8.02539 9.56641 7.89844 9.86523 7.73438 10.1426C7.57422 10.4199 7.37891 10.6738 7.14844 10.9043C6.92188 11.1309 6.66992 11.3262 6.39258 11.4902C6.11523 11.6504 5.81641 11.7754 5.49609 11.8652C5.17578 11.9551 4.84375 12 4.5 12C4.15625 12 3.82422 11.9551 3.50391 11.8652C3.18359 11.7754 2.88477 11.6504 2.60742 11.4902C2.33008 11.3262 2.07617 11.1309 1.8457 10.9043C1.61914 10.6738 1.42383 10.4199 1.25977 10.1426C1.09961 9.86523 0.974609 9.56641 0.884766 9.24609C0.794922 8.92578 0.75 8.59375 0.75 8.25C0.75 8.00391 0.777344 7.76172 0.832031 7.52344C0.890625 7.28516 0.974609 7.05469 1.08398 6.83203L4.5 0L7.91602 6.83203Z'></path>
                  </svg>{' '}
                  <span className='humidity-percent'>{selectedWeather[0]?.main?.humidity}%</span>
                  <div>
                    <span className='speed-wind'>{convertSpeed(selectedWeather[0]?.wind?.speed)} km/h</span>
                    <svg width='7' height='10' viewBox='0 0 10 14' style={{ transform: 'rotate(-40deg)' }}>
                      <path d='M5 0L9.66895 14L5 9.33105L0.331055 14L5 0Z' fill='black'></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className='hour'>Now</div>
            </div>
          )}

          {selectedWeather?.slice(-8).map((item: any, index: number) => (
            <div key={index} className='column-hour'>
              <div className='weather'>
                <div className='day'>{getDate(item?.dt)}</div>
                <img className='weather-icon' src={convertLinkImg(item?.weather[0]?.icon)} alt='weather-icon' />
                <div className='temperature'>{item?.main?.temp}°</div>
                <div className='weather-status'>{item?.weather[0]?.main}</div>

                <div className='bottom-card'>
                  <svg width='10' height='10' viewBox='0 0 9 12' fill='black'>
                    <path d='M7.91602 6.83203C8.02539 7.05469 8.10742 7.28516 8.16211 7.52344C8.2207 7.76172 8.25 8.00391 8.25 8.25C8.25 8.59375 8.20508 8.92578 8.11523 9.24609C8.02539 9.56641 7.89844 9.86523 7.73438 10.1426C7.57422 10.4199 7.37891 10.6738 7.14844 10.9043C6.92188 11.1309 6.66992 11.3262 6.39258 11.4902C6.11523 11.6504 5.81641 11.7754 5.49609 11.8652C5.17578 11.9551 4.84375 12 4.5 12C4.15625 12 3.82422 11.9551 3.50391 11.8652C3.18359 11.7754 2.88477 11.6504 2.60742 11.4902C2.33008 11.3262 2.07617 11.1309 1.8457 10.9043C1.61914 10.6738 1.42383 10.4199 1.25977 10.1426C1.09961 9.86523 0.974609 9.56641 0.884766 9.24609C0.794922 8.92578 0.75 8.59375 0.75 8.25C0.75 8.00391 0.777344 7.76172 0.832031 7.52344C0.890625 7.28516 0.974609 7.05469 1.08398 6.83203L4.5 0L7.91602 6.83203Z'></path>
                  </svg>{' '}
                  <span className='humidity-percent'>{item?.main?.humidity}%</span>
                  <div>
                    <span className='speed-wind'>{convertSpeed(item?.wind?.speed)} km/h</span>
                    <svg width='7' height='10' viewBox='0 0 10 14' style={{ transform: 'rotate(-40deg)' }}>
                      <path d='M5 0L9.66895 14L5 9.33105L0.331055 14L5 0Z' fill='black'></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className='hour'>{getHour(item?.dt)}</div>
            </div>
          ))}
        </div>
        <button className='every-hour-display-button-left' onClick={prevSlide}>
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

        <button className='every-hour-display-button-right' onClick={nextSlide}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path
              d='M7.57107 11.8403C6.90803 12.2987 6 11.8271 6 11.0244V4.97557C6 4.17283 6.90803 3.70129 7.57106 4.1597L11.3555 6.77618C12.2133 7.3693 12.2134 8.63066 11.3555 9.22378L7.57107 11.8403Z'
              fill='#1A1A1A'
            ></path>
          </svg>
        </button>
      </div>
    </>
  )
}

export default Hourly
