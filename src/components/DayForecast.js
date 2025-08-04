import React, { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const DayForecast = ({ city }) => {
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDaily = async () => {
      setLoading(true);
      setError(null);
      setDaily([]);
      try {
        if (!city?.lat || !city?.lon) throw new Error('No city selected');
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Failed to fetch daily forecast');
        const data = await res.json();
        setDaily(data.daily?.slice(0, 8) || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDaily();
  }, [city]);

  const getDay = (dt) => {
    return new Date(dt * 1000).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="card" style={{ padding: '1.2rem', margin: 0, marginBottom: 16 }}>
      <h4 style={{ color: 'var(--color-accent)', marginBottom: 16 }}>Next 7 Days</h4>
      {loading && <div style={{ color: 'var(--color-muted)' }}>Loading...</div>}
      {error && <div style={{ color: 'var(--color-muted)' }}>{error}</div>}
      {!loading && !error && (
        <div className="daily-list">
          {daily.map((d, i) => (
            <div className="daily-item" key={i}>
              <div className="daily-day">{getDay(d.dt)}</div>
              <img
                src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
                alt={d.weather[0].main}
                className="daily-icon"
                style={{ width: 38, height: 38 }}
              />
              <div className="daily-temps">
                <span className="daily-temp-max">{Math.round(d.temp.max)}&deg;C</span>
                <span className="daily-temp-min">{Math.round(d.temp.min)}&deg;C</span>
              </div>
              <div className="daily-condition">{d.weather[0].main}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayForecast;