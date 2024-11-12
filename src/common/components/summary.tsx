import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


interface SummaryProps {
  selectedWeather: any[]
  weather: any
  weather5day: any
}

interface DataState {
  labels: number[];
  datasets: {
    label: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    hoverBackgroundColor: string;
    hoverBorderColor: string;
    data: number[];
  }[];
}

const Summary: React.FC<SummaryProps> = ({selectedWeather, weather, weather5day}) => {
  const [data, setData] = useState<DataState>({
    labels: [],
    datasets: [
      {
        label: 'Temperature',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [],
      },
    ],
  });

  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  });

  useEffect(() => {
    console.log('selectedWeather: ', selectedWeather);
    console.log('weather: ', weather);
    console.log('weather5day: ', weather5day);
    
    let bigArray = [];
    bigArray.push(weather);
    for (let i = 0; i < 40; i++) {
      if (weather5day?.list[i]?.dt > weather?.dt) {
        bigArray.push(weather5day?.list[i]);
      }
    }
    console.log('bigArray: ', bigArray);

    let temperatureArray = [];
    let humidityArray = [];
    let hourArray = [];

    for (let i = 0; i < bigArray.length; i++) {
      temperatureArray.push(bigArray[i]?.main?.temp);
      humidityArray.push(bigArray[i]?.main?.humidity);
      hourArray.push(new Date(bigArray[i]?.dt * 1000).getHours());
    }
    console.log('temperatureArray: ', temperatureArray);
    console.log('hourArray: ', hourArray)

    setData({
      labels: hourArray,
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: temperatureArray,
        },
      ]
    });
  }, [selectedWeather, weather, weather5day]);

  

  return (
    <>
      <div className='summary-display'>
        {data != null && options != null&& <Line data={data} options={options} />}
      </div>
    </>
  )
}

export default Summary