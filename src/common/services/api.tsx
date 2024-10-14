const apiKey = '4f2141f03c148886930241854489683e';
const baseUrl = 'https://api.openweathermap.org/data/2.5';
 
export const fetchWeather = async (city: string): Promise<any> => {
  const apiUrl = `${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
