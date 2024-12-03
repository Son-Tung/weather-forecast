import React from 'react'

interface LegendProps {
  type: 'temperature' | 'windSpeed' | 'cloudCover'
}

const getGradient = (type: string) => {
  const gradients = {
    temperature:
      'linear-gradient(to right, rgb(159, 85, 181) 0%, rgb(44, 106, 187) 8.75%, rgb(82, 139, 213) 12.5%, rgb(103, 163, 222) 18.75%, rgb(142, 202, 240) 25%, rgb(155, 213, 244) 31.25%, rgb(172, 225, 253) 37.5%, rgb(194, 234, 255) 43.75%, rgb(255, 255, 208) 50%, rgb(254, 248, 174) 56.25%, rgb(254, 232, 146) 62.5%, rgb(254, 226, 112) 68.75%, rgb(253, 212, 97) 75%, rgb(244, 168, 94) 82.5%, rgb(244, 129, 89) 87.5%, rgb(244, 104, 89) 93.75%, rgb(244, 76, 73) 100%)',
    windSpeed:
      'linear-gradient(to left, rgb(158, 128, 177), rgba(116, 76, 172, 0.9), rgb(164, 123, 170), rgba(170, 128, 177, 0.84), rgba(176, 128, 177, 0.71), rgba(170, 128, 177, 0.54), rgba(170, 128, 177, 0.44), rgba(255, 255, 0, 0))',
    cloudCover:
      'linear-gradient(to right, rgba(247, 247, 255, 0) 0%, rgba(251, 247, 255, 0) 10%, rgba(244, 248, 255, 0.1) 20%, rgba(240, 249, 255, 0.2) 30%, rgba(221, 250, 255, 0.4) 40%, rgba(224, 224, 224, 0.9) 50%, rgba(224, 224, 224, 0.76) 60%, rgba(228, 228, 228, 0.9) 70%, rgba(232, 232, 232, 0.9) 80%, rgb(214, 213, 213) 90%, rgb(210, 210, 210) 95%, rgb(183, 183, 183) 100%)'
  }
  return gradients[type as keyof typeof gradients]
}

const Legend: React.FC<LegendProps> = ({ type }) => {
  const grades = {
    temperature: [-40, -20, 0, 20, 40],
    windSpeed: [0, 2, 3, 4, 12, 25, 50, 100],
    cloudCover: [0, 25, 50, 75, 100]
  }
  const labels: { [key: string]: string } = {
    temperature: 'Temperature(°C)',
    windSpeed: 'Wind Speed(m/s)',
    cloudCover: 'Clouds(%)'
  }

  return (
    <div className='legend-box'>
      <div className='legend-label'>{labels[type]}</div>
      <div className='legend-child'>
        <div className='legend-values'>
          {grades[type as keyof typeof grades].map((grade) => (
            <span key={grade}>{grade}</span>
          ))}
        </div>
        <div className='legend-gradient' style={{ background: getGradient(type) }}></div>
      </div>
    </div>
  )
}

export default Legend
