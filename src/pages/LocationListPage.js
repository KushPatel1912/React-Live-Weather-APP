import React from 'react';

const demoFavorites = [
  { name: 'Bengaluru', country: 'IN', lat: 12.9716, lon: 77.5946 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006 },
];
const demoRecents = [
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'JP', lat: 35.6895, lon: 139.6917 },
];

const LocationListPage = ({ onSelect }) => (
  <div style={{ maxWidth: 500, margin: '0 auto', paddingBottom: 80 }}>
    <div className="card" style={{ textAlign: 'left', marginBottom: 24 }}>
      <h2 style={{ color: 'var(--color-accent)', marginBottom: 18 }}>Favorites</h2>
      {demoFavorites.map(city => (
        <div
          key={city.name}
          className="location-list-item"
          style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
          onClick={() => onSelect && onSelect(city)}
        >
          <span style={{ fontWeight: 500 }}>{city.name}, {city.country}</span>
          <span style={{ float: 'right', color: 'var(--color-accent)' }}>★</span>
          <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>Weather summary...</div>
        </div>
      ))}
      {demoFavorites.length === 0 && <div style={{ color: 'var(--color-muted)' }}>No favorites yet.</div>}
    </div>
    <div className="card" style={{ textAlign: 'left' }}>
      <h2 style={{ color: 'var(--color-accent)', marginBottom: 18 }}>Recents</h2>
      {demoRecents.map(city => (
        <div
          key={city.name}
          className="location-list-item"
          style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
          onClick={() => onSelect && onSelect(city)}
        >
          <span style={{ fontWeight: 500 }}>{city.name}, {city.country}</span>
          <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>Weather summary...</div>
        </div>
      ))}
      {demoRecents.length === 0 && <div style={{ color: 'var(--color-muted)' }}>No recent locations.</div>}
    </div>
  </div>
);

export default LocationListPage;