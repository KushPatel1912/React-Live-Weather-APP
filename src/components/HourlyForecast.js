import React, { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const HourlyForecast = ({ city }) => {
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHourly = async () => {
      setLoading(true);
      setError(null);
      setHourly([]);
      try {
        if (!city?.lat || !city?.lon) throw new Error('No city selected');
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&exclude=current,minutely,daily,alerts&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Failed to fetch hourly forecast');
        const data = await res.json();
        setHourly(data.hourly?.slice(0, 12) || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHourly();
  }, [city]);

  return (
    <div className="card" style={{ padding: '1.2rem', margin: 0, marginBottom: 16 }}>
      <h4 style={{ color: 'var(--color-accent)', marginBottom: 16 }}>Next 12 Hours</h4>
      {loading && <div style={{ color: 'var(--color-muted)' }}>Loading...</div>}
      {error && <div style={{ color: 'var(--color-muted)' }}>{error}</div>}
      {!loading && !error && (
        <div className="hourly-scroll">
          {hourly.map((h, i) => (
            <div className="hourly-item" key={i}>
              <div className="hourly-hour">
                {new Date(h.dt * 1000).getHours()}:00
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`}
                alt={h.weather[0].main}
                className="hourly-icon"
                style={{ width: 38, height: 38 }}
              />
              <div className="hourly-temp">
                {Math.round(h.temp)}&deg;C
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HourlyForecast;