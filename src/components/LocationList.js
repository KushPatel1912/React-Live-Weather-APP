import React, { useState } from 'react';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const LocationList = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);

  const fetchSuggestions = async (q) => {
    if (!q) return setSuggestions([]);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setError('Could not fetch cities');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowList(true);
    fetchSuggestions(val);
  };

  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <input
        className="location-search-input"
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={handleChange}
        onFocus={() => setShowList(true)}
        style={{
          width: '100%',
          padding: '0.8rem 1.2rem',
          borderRadius: 12,
          border: '1px solid var(--color-border)',
          background: 'var(--color-card)',
          color: 'var(--color-text)',
          fontSize: 16,
        }}
      />
      {showList && query && (
        <div className="location-suggestions" style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          right: 0,
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          zIndex: 10,
        }}>
          {loading && (
            <div style={{ padding: '0.7rem 1.2rem', color: 'var(--color-muted)' }}>
              Loading...
            </div>
          )}
          {error && (
            <div style={{ padding: '0.7rem 1.2rem', color: 'var(--color-muted)' }}>
              {error}
            </div>
          )}
          {!loading && !error && suggestions.length === 0 && (
            <div style={{ padding: '0.7rem 1.2rem', color: 'var(--color-muted)' }}>
              No results
            </div>
          )}
          {suggestions.map(city => (
            <div
              key={city.lat + city.lon}
              className="location-suggestion"
              style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', color: 'var(--color-text)' }}
              onClick={() => {
                setQuery(city.name);
                setShowList(false);
                onSelect && onSelect({
                  name: city.name,
                  country: city.country,
                  lat: city.lat,
                  lon: city.lon,
                });
              }}
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationList;