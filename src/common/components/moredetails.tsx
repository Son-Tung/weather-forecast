import '../styles/moredetails.scss';
import { useState, useEffect } from 'react';
import {
  FaMapPin,
  FaThermometerHalf,
  FaEye,
  FaWind,
  FaCloud,
  FaTachometerAlt,
  FaWater,
  FaMountain,
  FaClock,
  FaTint,
  FaMapMarkerAlt,
  FaSnowflake,
} from 'react-icons/fa';
import SunriseIcon from '../../assets/images/sunrise.svg';
import SunsetIcon from '../../assets/images/sunset.svg';

interface SunriseSunsetData {
  sunrise: string;
  sunset: string;
  date: string;
}

interface MoreDetailsProps {
  selectedWeather: any[];
  weather: any;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface WeatherData {
  timezone: number;
  weather: [WeatherCondition];
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  clouds: { all: number };
  rain?: { '3h'?: number };
  snow?: { '3h'?: number };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
  cod: number;
}

// Các hàm helper nhỏ để khởi tạo từng phần
const getInitialWeatherCondition = (): WeatherCondition => ({
  id: 0,
  main: '',
  description: '',
  icon: ''
});

const getInitialMainWeatherData = (): MainWeatherData => ({
  temp: 0,
  feels_like: 0,
  temp_min: 0,
  temp_max: 0,
  pressure: 0,
  humidity: 0,
  sea_level: 0,
  grnd_level: 0
});

const getInitialWind = (): Wind => ({
  speed: 0,
  deg: 0,
  gust: 0
});

const getInitialWeatherData = (): WeatherData => ({
  timezone: 0,
  weather: [getInitialWeatherCondition()],
  main: getInitialMainWeatherData(),
  visibility: 0,
  wind: getInitialWind(),
  clouds: { all: 0 },
  rain: { '3h': 0 },
  snow: { '3h': 0 },
  dt: 0,
  sys: {
    country: '',
    sunrise: 0,
    sunset: 0
  },
  coord: {
    lat: 0,
    lon: 0
  },
  name: '',
  cod: 0
});

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const useSunriseSunset = (lat?: number, lon?: number) => {
  const [sunData, setSunData] = useState<{ [key: string]: SunriseSunsetData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSunData = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=${userTimezone}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch sunrise-sunset data');
        }
    
        const data = await response.json();
        const groupedData = data.daily.time.map((time: string, index: number) => {
          const date = new Date(time).toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
          });
        
          return {
            date,
            sunrise: data.daily.sunrise[index],
            sunset: data.daily.sunset[index],
          };
        });
        
        // Explicitly define type for `data` in `forEach`
        const sunDataObj: { [key: string]: SunriseSunsetData } = {};
        groupedData.forEach((data: { date: string, sunrise: string, sunset: string }) => {
          sunDataObj[data.date] = data;
        });
        
        setSunData(sunDataObj);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (lat !== undefined && lon !== undefined && Number.isFinite(lat) && Number.isFinite(lon)) {
      fetchSunData();
    } else {
      setLoading(false);
    }
  }, [lat, lon]);

  return { sunData, loading, error };
};

const MoreDetails = ({ selectedWeather, weather }: MoreDetailsProps) => {
  const primaryWeather: WeatherData = selectedWeather?.[0] || getInitialWeatherData();
  const hasWeather = selectedWeather?.length > 0;
  const lat = weather?.coord?.lat ?? selectedWeather?.[0]?.coord?.lat;
  const lon = weather?.coord?.lon ?? selectedWeather?.[0]?.coord?.lon;
  const { sunData } = useSunriseSunset(lat, lon);

  const formatTime = (timestamp: string | number): string => {
    if (!timestamp) return 'N/A';
    
    if (typeof timestamp === 'number') {
      return new Date(timestamp * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Group weather data by day
  const groupedByDay = selectedWeather?.reduce((acc, curr) => {
    const date = new Date(curr.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
    });
    const hour = new Date(curr.dt * 1000).getHours();
    if (hour >= 0 && hour <= 21) {
      if (!acc[date]) {
        acc[date] = {
          temp_max: curr.main.temp_max,
          temp_min: curr.main.temp_min,
          weather: curr.weather[0],
          humidity: curr.main.humidity,
          date: new Date(curr.dt * 1000),
        };
      } else {
        acc[date].temp_max = Math.max(acc[date].temp_max, curr.main.temp_max);
        acc[date].temp_min = Math.min(acc[date].temp_min, curr.main.temp_min);
        acc[date].humidity = Math.max(acc[date].humidity, curr.main.humidity);
      }
    }
    return acc;
  }, {});

  // Get the first day (current day) from groupedByDay
  const firstDay = Object.keys(groupedByDay || {})[0];
  const minTemp = firstDay ? groupedByDay[firstDay].temp_min : 'N/A';
  const maxTemp = firstDay ? groupedByDay[firstDay].temp_max : 'N/A';
  const displayMinTemp = typeof minTemp === 'number' ? Math.ceil(minTemp) : 'N/A';
  const displayMaxTemp = typeof maxTemp === 'number' ? Math.ceil(maxTemp) : 'N/A';

const getAverageByDay = (
  weatherData: any[],
  valueExtractor: (item: any) => number,
  unit: string,
  round: boolean = false
): string => {
  const groupedData = weatherData.reduce((acc: any, curr) => {
    const date = new Date(curr.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
    });

    if (!acc[date]) {
      acc[date] = [];
    }

    const value = valueExtractor(curr) ?? 0;
    acc[date].push(value);

    return acc;
  }, {});

  const firstDay = Object.keys(groupedData || {})[0];

  if (firstDay && groupedData[firstDay].length > 0) {
    const total = groupedData[firstDay].reduce(
      (sum: number, val: number) => sum + val,
      0
    );

    const avg = total / groupedData[firstDay].length;

    return round
      ? `${Math.round(avg)}${unit}`
      : `${avg.toFixed(2)}${unit}`;
  }

  return `0${unit}`;
};

  const averageRain = getAverageByDay(
  selectedWeather,
  (item) => item.rain?.['3h'],
  " mm"
);

  const averageSnow = getAverageByDay(
  selectedWeather,
  (item) => item.snow?.['3h'],
  " mm"
);

  const averageHumidity = getAverageByDay(
  selectedWeather,
  (item) => item.main?.humidity,
  "%",
  true
);

  const getCountryName = (countryCode: string): string => {
    try {
      const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode);
      return countryName || countryCode; // Nếu không tìm thấy, trả về mã quốc gia gốc
    } catch (e) {
      return countryCode; // Trả về mã quốc gia nếu có lỗi
    }
  };

  return (
    <div className="details">
      <div className="details-content">
        {hasWeather && (
          <>
            <div className="weather-info-left">
              <h3>Sun Information</h3>
              <div className="sun-info">
                <div className="info-header">
                  <FaMapMarkerAlt className="weather-icon location" />
                  <div className="info-text">
                    <p>Lat and Lon</p>
                    <p className="lat-lon-value">
                      {lat ?? 'N/A'} and {lon ?? 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="path-container">
                  <div className="sun-path">
                    <div className="path-line"></div>
                    <div className="sun-indicator"></div>
                  </div>
                  <div className="time-labels">
                    <div className="time-label sunrise">
                      <p>Sunrise</p>
                      <p className="time">{formatTime(sunData[firstDay]?.sunrise)}</p>
                      <img src={SunriseIcon} alt="Sunrise" className="sunrise-icon" />
                    </div>
                    <div className="time-label sunset">
                      <p>Sunset</p>
                      <p className="time">{formatTime(sunData[firstDay]?.sunset)}</p>
                      <img src={SunsetIcon} alt="Sunset" className="sunset-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="weather-info-right">
              <h3>Detailed Information</h3>
              <div className="weather-details">
                <div>
                  <FaMapPin className="weather-icon" style={{ color: 'black' }} />{' '}
                  <strong>Location:</strong> {weather?.name || primaryWeather.name}
                </div>
                <div>
                  <FaClock className="weather-icon" style={{ color: 'gray' }} />{' '}
                  <strong>Timezone:</strong> {(weather?.timezone ?? primaryWeather.timezone) / 3600} UTC
                </div>
                <div>
                  <FaThermometerHalf className="weather-icon" style={{ color: 'red' }} />{' '}
                  <strong>Temperature:</strong> {primaryWeather.main.temp}°C
                </div>
                <div>
                  <FaThermometerHalf className="weather-icon" style={{ color: 'red' }} />{' '}
                  <strong>Feels Like:</strong> {primaryWeather.main.feels_like}°C
                </div>
                <div>
                  <FaThermometerHalf className="weather-icon" style={{ color: 'red' }} />{' '}
                  <strong>Max Temperature:</strong> {displayMaxTemp}°C
                </div>
                <div>
                  <FaThermometerHalf className="weather-icon" style={{ color: 'red' }} />{' '}
                  <strong>Min Temperature:</strong> {displayMinTemp}°C
                </div>
                <div>
                  <FaTachometerAlt className="weather-icon" style={{ color: 'darkgray' }} />{' '}
                  <strong>Pressure:</strong> {primaryWeather.main.pressure} hPa
                </div>
                <div>
                  <FaWater className="weather-icon" style={{ color: 'blue' }} />{' '}
                  <strong>Sea Pressure:</strong> {primaryWeather.main.sea_level} hPa
                </div>
                <div>
                  <FaMountain className="weather-icon" style={{ color: 'brown' }} />{' '}
                  <strong>Ground Pressure:</strong> {primaryWeather.main.grnd_level} hPa
                </div>
                <div>
                  <FaSnowflake className="weather-icon" style={{ color: 'lightblue' }} />{' '}
                  <strong>Snow (Avg/Day):</strong> {averageSnow}
                </div>
                <div>
                  <FaTint className="weather-icon" style={{ color: 'lightblue' }} />{' '}
                  <strong>Rain (Avg/Day):</strong> {averageRain} 
                </div>
                <div>
                  <FaTint className="weather-icon" style={{ color: 'lightblue' }} />{' '}
                  <strong>Humidity (Avg/Day):</strong> {averageHumidity}
                </div>
                <div>
                  <FaEye className="weather-icon" style={{ color: 'green' }} />{' '}
                  <strong>Visibility:</strong> {Number((primaryWeather.visibility / 1000).toFixed(1))} km
                </div>
                <div>
                  <FaWind className="weather-icon" style={{ color: 'lightblue' }} />{' '}
                  <strong>Wind Gust:</strong> {primaryWeather.wind.gust ? `${primaryWeather.wind.gust} km/h` : '0 km/h'}
                </div>
                <div>
                  <FaWind className="weather-icon" style={{ color: 'lightblue' }} />{' '}
                  <strong>Wind Direction:</strong> {primaryWeather.wind.deg}°
                </div>
                <div>
                  <FaCloud className="weather-icon" style={{ color: 'gray' }} />{' '}
                  <strong>Clouds:</strong> {primaryWeather.clouds.all}%
                </div>
                <div>
                  <strong>Weather:</strong> {primaryWeather?.weather[0]?.description || 'No data available'}
                </div>
                <div>
                  <FaMapMarkerAlt className="weather-icon" style={{ color: 'darkblue' }} />{' '}
                  <strong>Country:</strong> {getCountryName((weather?.sys?.country || primaryWeather.sys.country))} ({weather?.sys?.country || primaryWeather.sys.country})
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoreDetails;
