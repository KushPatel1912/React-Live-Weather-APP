import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMap = ({ city }) => {
  if (!city?.lat || !city?.lon) {
    return <div className="card">Loading map...</div>;
  }

  return (
    <div className="card" style={{ padding: 0, height: 320, margin: 0, marginBottom: 16, overflow: 'hidden' }}>
      <MapContainer
        center={[city.lat, city.lon]}
        zoom={11}
        style={{ height: 320, width: '100%', borderRadius: 12 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={[city.lat, city.lon]}>
          <Popup>
            {city.name}, {city.country}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;