import '../styles/detail5day.css'

import React, { useState, useEffect, useRef } from 'react'

interface Detail5dayProps {
  weather: any
  data5day: any
}

const Detail5day: React.FC<Detail5dayProps> = ({ weather, data5day }) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(0)

  useEffect(() => {
    handleButtonClick('summary')
    window.addEventListener('resize', updateSlidesToShow) // Thêm event listener
    return () => {
      window.removeEventListener('resize', updateSlidesToShow) // Bỏ đăng ký khi component unmount
    }
  }, [])

  useEffect(() => {
    let dateNow: Date = new Date() // chinh thoi gian goc tai day
    let data5dayFiltered = data5day // Lưu trữ dữ liệu 5-day forecast trước khi lọc

    // Xóa các mốc thời gian trước thời gian hiện tại
    while (dateNow > new Date(data5dayFiltered?.list[0]?.dt_txt)) {
      data5dayFiltered?.list?.shift()
    }

    console.log('data5dayFiltered:', data5dayFiltered)
    updateSlidesToShow()
  }, [data5day]) // Chạy lại khi data5day thay đổi

  useEffect(() => {
    const leftButton = document.querySelector<HTMLElement>('.every-hour-display-button-left')
    const rightButton = document.querySelector<HTMLElement>('.every-hour-display-button-right')

    if (containerWidth >= 1058) {
      if (leftButton) {
        leftButton.style.display = 'none'
      }
      if (rightButton) {
        rightButton.style.display = 'none'
      }
    } else {
      if (currentSlide === 0) {
        if (leftButton) {
          leftButton.style.display = 'none'
        }
        if (rightButton) {
          rightButton.style.display = 'block'
        }
      } else if (currentSlide === 9 - slidesToShow) {
        if (leftButton) {
          leftButton.style.display = 'block'
        }
        if (rightButton) {
          rightButton.style.display = 'none'
        }
      } else {
        if (leftButton) {
          leftButton.style.display = 'block'
        }
        if (rightButton) {
          rightButton.style.display = 'block'
        }
      }
    }
  }, [currentSlide, slidesToShow, containerWidth]) // Theo dõi sự thay đổi của currentSlide và slidesToShow

  function updateSlidesToShow() {
    setCurrentSlide(0) // Reset về 0 để tránh gặp lỗi
    if (contentRef.current) {
      const gridContainer = document.querySelector('.every-hour-display-container') as HTMLElement
      gridContainer.style.display = 'grid'
      let width = contentRef.current.clientWidth // Lấy chiều rộng của contentRef
      setContainerWidth(width)
      let calculatedNumColumn
      if (width >= 1058) {
        gridContainer.style.gridTemplateColumns = `repeat(9, ${(114 / 1058) * 100}%)` // 9 cột, mỗi cột 114px
        gridContainer.style.columnGap = `${(4 / 1058) * 100}%` // Khoảng cách giữa các cột
        calculatedNumColumn = 9
      } else {
        let columnCount = Math.floor((width + 4) / 118)
        let tempWidth = 118 * columnCount - 4
        let reponsiveRate = width / tempWidth

        let columnGap = 4 * reponsiveRate
        let columnWidth = 114 * reponsiveRate

        gridContainer.style.gridTemplateColumns = `repeat(9, ${columnWidth}px)`
        gridContainer.style.columnGap = `${columnGap}px`
        calculatedNumColumn = columnCount
      }

      if (calculatedNumColumn !== slidesToShow) {
        setSlidesToShow(calculatedNumColumn)
        console.log('slidesToShow: ', calculatedNumColumn)
      }
    }
  }

  function nextSlide() {
    setCurrentSlide(function (prevSlide) {
      let slideCount = prevSlide + slidesToShow
      if (slideCount > 9 - slidesToShow) {
        console.log('currentSlide:', 9 - slidesToShow)
        return 9 - slidesToShow
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

  function handleButtonClick(display: string) {
    // Xóa lớp 'active' khỏi tất cả các phần tử
    document
      .querySelectorAll(
        '.summary-button, .every-hour-button, .more-detail-button, .summary-display, .every-hour-display, .more-detail-display'
      )
      .forEach((el) => {
        el.classList.remove('active')
      })

    // Thêm lớp 'active' cho phần tử được chọn
    switch (display) {
      case 'summary':
        document.querySelector('.summary-button')?.classList.add('active')
        document.querySelector('.summary-display')?.classList.add('active')
        return
      case 'hourly':
        document.querySelector('.every-hour-button')?.classList.add('active')
        document.querySelector('.every-hour-display')?.classList.add('active')
        return
      case 'detail':
        document.querySelector('.more-detail-button')?.classList.add('active')
        document.querySelector('.more-detail-display')?.classList.add('active')
        return
      default:
        return
    }
  }

  function convertLinkImg(iconCode: string) {
    switch (iconCode) {
      case '01d':
      case '01n':
        return 'src/assets/images/svg/sunny.svg'
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04n':
      case '04d':
        return 'src/assets/images/svg/cloud.svg'
      default:
        return 'src/assets/images/svg/rain.svg'
    }
  }

  function convertSpeed(speed: number) {
    return Math.round(speed * 36) / 10
  }

  function getHour(dateString: string) {
    const date = new Date(dateString)
    const hours = date.getHours() // Đảm bảo có 2 chữ số

    if (hours <= 12) {
      return `${hours} AM`
    } else {
      return `${hours - 12} PM`
    }
  }

  function getDate(dateString: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date(dateString)
    const month = months[date.getMonth()]
    const day = date.getDate()
    const hour = date.getHours()

    // Kiểm tra nếu giờ là 0 (nửa đêm)
    if (hour === 0) {
      return `${month} ${day}`
    } else {
      return ''
    }
  }

  return (
    <>
      <div className='detail-5-day-sidebar'>
        <button className='summary-button' onClick={() => handleButtonClick('summary')}>
          Summary
        </button>
        <button className='every-hour-button' onClick={() => handleButtonClick('hourly')}>
          Hourly
        </button>
        <button className='more-detail-button' onClick={() => handleButtonClick('detail')}>
          More details
        </button>
      </div>

      <div className='detail-5-day-content' ref={contentRef}>
        <div className='summary-display'></div>

        <div className='every-hour-display'>
          <div
            className='every-hour-display-container'
            style={{ transform: `translateX(-${(currentSlide * 100) / slidesToShow}%)` }}
          >
            <div className='column-hour'>
              <div className='weather'>
                <div className='day'>Today</div>
                <img className='weather-icon' src={convertLinkImg(weather?.weather[0]?.icon)} alt='weather-icon' />

                <div className='temperature'>{weather?.main?.temp}°</div>
                <div className='weather-status'>{weather?.weather[0]?.main}</div>

                <div className='bottom-card'>
                  <svg width='10' height='10' viewBox='0 0 9 12' fill='black'>
                    <path d='M7.91602 6.83203C8.02539 7.05469 8.10742 7.28516 8.16211 7.52344C8.2207 7.76172 8.25 8.00391 8.25 8.25C8.25 8.59375 8.20508 8.92578 8.11523 9.24609C8.02539 9.56641 7.89844 9.86523 7.73438 10.1426C7.57422 10.4199 7.37891 10.6738 7.14844 10.9043C6.92188 11.1309 6.66992 11.3262 6.39258 11.4902C6.11523 11.6504 5.81641 11.7754 5.49609 11.8652C5.17578 11.9551 4.84375 12 4.5 12C4.15625 12 3.82422 11.9551 3.50391 11.8652C3.18359 11.7754 2.88477 11.6504 2.60742 11.4902C2.33008 11.3262 2.07617 11.1309 1.8457 10.9043C1.61914 10.6738 1.42383 10.4199 1.25977 10.1426C1.09961 9.86523 0.974609 9.56641 0.884766 9.24609C0.794922 8.92578 0.75 8.59375 0.75 8.25C0.75 8.00391 0.777344 7.76172 0.832031 7.52344C0.890625 7.28516 0.974609 7.05469 1.08398 6.83203L4.5 0L7.91602 6.83203Z'></path>
                  </svg>{' '}
                  <span className='humidity-percent'>{weather?.main?.humidity}%</span>
                  <div>
                    <span className='speed-wind'>{convertSpeed(weather?.wind?.speed)} km/h</span>
                    <svg width='7' height='10' viewBox='0 0 10 14' style={{ transform: 'rotate(-40deg)' }}>
                      <path d='M5 0L9.66895 14L5 9.33105L0.331055 14L5 0Z' fill='black'></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className='hour'>Now</div>
            </div>

            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='column-hour'>
                <div className='weather'>
                  <div className='day'>{getDate(data5day?.list[index]?.dt_txt)}</div>
                  <img
                    className='weather-icon'
                    src={convertLinkImg(data5day?.list[index]?.weather[0]?.icon)}
                    alt='weather-icon'
                  />
                  <div className='temperature'>{data5day?.list[index]?.main?.temp}°</div>
                  <div className='weather-status'>{data5day?.list[index]?.weather[0]?.main}</div>

                  <div className='bottom-card'>
                    <svg width='10' height='10' viewBox='0 0 9 12' fill='black'>
                      <path d='M7.91602 6.83203C8.02539 7.05469 8.10742 7.28516 8.16211 7.52344C8.2207 7.76172 8.25 8.00391 8.25 8.25C8.25 8.59375 8.20508 8.92578 8.11523 9.24609C8.02539 9.56641 7.89844 9.86523 7.73438 10.1426C7.57422 10.4199 7.37891 10.6738 7.14844 10.9043C6.92188 11.1309 6.66992 11.3262 6.39258 11.4902C6.11523 11.6504 5.81641 11.7754 5.49609 11.8652C5.17578 11.9551 4.84375 12 4.5 12C4.15625 12 3.82422 11.9551 3.50391 11.8652C3.18359 11.7754 2.88477 11.6504 2.60742 11.4902C2.33008 11.3262 2.07617 11.1309 1.8457 10.9043C1.61914 10.6738 1.42383 10.4199 1.25977 10.1426C1.09961 9.86523 0.974609 9.56641 0.884766 9.24609C0.794922 8.92578 0.75 8.59375 0.75 8.25C0.75 8.00391 0.777344 7.76172 0.832031 7.52344C0.890625 7.28516 0.974609 7.05469 1.08398 6.83203L4.5 0L7.91602 6.83203Z'></path>
                    </svg>{' '}
                    <span className='humidity-percent'>{data5day?.list[index]?.main?.humidity}%</span>
                    <div>
                      <span className='speed-wind'>{convertSpeed(data5day?.list[index]?.wind?.speed)} km/h</span>
                      <svg width='7' height='10' viewBox='0 0 10 14' style={{ transform: 'rotate(-40deg)' }}>
                        <path d='M5 0L9.66895 14L5 9.33105L0.331055 14L5 0Z' fill='black'></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='hour'>{getHour(data5day?.list[index]?.dt_txt)}</div>
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

        <div className='more-detail-display'></div>
      </div>
    </>
  )
}

export default Detail5day
