import { useState, useEffect } from 'react';

const API_KEY = '0a3cb46c40f15ca7e4d04feafba79a0a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const useWeather = (lat, lon) => {
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Fetch current weather
        const currentRes = await fetch(
          `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const currentData = await currentRes.json();
        
        // Fetch forecast data (hourly and daily)
        const forecastRes = await fetch(
          `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,alerts`
        );
        const forecastData = await forecastRes.json();

        setCurrent(currentData);
        setHourly(forecastData.hourly);
        setDaily(forecastData.daily);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  return { current, hourly, daily, loading, error };
};
