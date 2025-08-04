import React from 'react';
import WeatherMap from '../components/WeatherMap';

const defaultCity = {
  name: 'Bengaluru',
  country: 'IN',
  lat: 12.9716,
  lon: 77.5946,
};

const Maps = () => (
  <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 80 }}>
    <WeatherMap city={defaultCity} />
  </div>
);

export default Maps;