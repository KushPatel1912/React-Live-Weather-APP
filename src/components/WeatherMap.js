/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom hook for map click events
const MapClickHandler = ({ onLocationClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationClick({ lat, lng });
    },
  });
  return null;
};

const WeatherMap = ({ city, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] =
    useState(null);
  const [loading, setLoading] = useState(false);

  // Default to Bengaluru if no city provided
  const defaultCity = city || {
    name: "Bengaluru",
    country: "IN",
    lat: 12.9716,
    lon: 77.5946,
  };

  const handleLocationClick = async (latlng) => {
    setLoading(true);

    try {
      // First, get city name from coordinates
      const apiKey =
        process.env.REACT_APP_WEATHER_API_KEY;
      const reverseGeocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latlng.lat}&lon=${latlng.lng}&limit=1&appid=${apiKey}`
      );

      if (reverseGeocodeResponse.ok) {
        const locationData =
          await reverseGeocodeResponse.json();
        if (locationData.length > 0) {
          const location = locationData[0];

          // Then get weather data
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&appid=${apiKey}&units=metric`
          );

          if (weatherResponse.ok) {
            const weather =
              await weatherResponse.json();
            setSelectedLocation({
              name: location.name,
              country: location.country,
              lat: latlng.lat,
              lon: latlng.lng,
              weather: weather,
            });

            // Call the parent callback if provided
            if (onLocationSelect) {
              onLocationSelect({
                name: location.name,
                country: location.country,
                lat: latlng.lat,
                lon: latlng.lng,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(
        "Error fetching location data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (!defaultCity?.lat || !defaultCity?.lon) {
    return (
      <motion.div
        className="glass-card"
        style={{
          padding: "48px",
          textAlign: "center",
          color: "var(--color-text-secondary)",
          fontSize: "18px",
          margin: "0 16px",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Loading map...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card"
      style={{
        padding: 0,
        height: 500,
        margin: "0 16px",
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        borderRadius: "28px",
        position: "relative",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Interactive Instructions Overlay */}
      <motion.div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          zIndex: 1000,
          background: "var(--gradient-glass)",
          backdropFilter: "blur(30px)",
          padding: "16px 24px",
          borderRadius: "16px",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
          fontSize: "16px",
          fontWeight: "600",
          textAlign: "center",
          boxShadow: "var(--shadow-md)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        🗺️ Click anywhere on the map to get weather
        data for that location
      </motion.div>

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
            background: "var(--gradient-glass)",
            backdropFilter: "blur(30px)",
            padding: "24px 32px",
            borderRadius: "20px",
            border: "1px solid var(--color-border)",
            color: "var(--color-accent)",
            fontSize: "18px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "var(--shadow-lg)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid var(--color-accent)",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          Loading weather data...
        </motion.div>
      )}

      <MapContainer
        center={[defaultCity.lat, defaultCity.lon]}
        zoom={10}
        style={{
          height: 500,
          width: "100%",
          borderRadius: "28px",
        }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Map click handler */}
        <MapClickHandler
          onLocationClick={handleLocationClick}
        />

        {/* Default city marker */}
        <Marker
          position={[defaultCity.lat, defaultCity.lon]}
        >
          <Popup>
            <div
              style={{
                color: "var(--color-text)",
                fontWeight: "600",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  marginBottom: "8px",
                }}
              >
                📍
              </div>
              {defaultCity.name}, {defaultCity.country}
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                  marginTop: "4px",
                }}
              >
                Default location
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Clicked location marker */}
        {selectedLocation && (
          <Marker
            position={[
              selectedLocation.lat,
              selectedLocation.lon,
            ]}
            icon={L.divIcon({
              className: "custom-marker",
              html: "📍",
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
          >
            <Popup>
              <motion.div
                style={{
                  color: "var(--color-text)",
                  fontWeight: "600",
                  fontSize: "16px",
                  textAlign: "center",
                  minWidth: "200px",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    marginBottom: "8px",
                  }}
                >
                  🌤️
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  {selectedLocation.name},{" "}
                  {selectedLocation.country}
                </div>
                {selectedLocation.weather && (
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        color: "var(--color-accent)",
                        marginBottom: "4px",
                      }}
                    >
                      {Math.round(
                        selectedLocation.weather.main
                          .temp
                      )}
                      °C
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color:
                          "var(--color-text-secondary)",
                        marginBottom: "8px",
                      }}
                    >
                      {
                        selectedLocation.weather
                          .weather[0].main
                      }
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color:
                          "var(--color-text-secondary)",
                      }}
                    >
                      Feels like:{" "}
                      {Math.round(
                        selectedLocation.weather.main
                          .feels_like
                      )}
                      °C
                    </div>
                  </div>
                )}
              </motion.div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Weather Data Display */}
      {selectedLocation &&
        selectedLocation.weather && (
          <motion.div
            className="glass-card"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              right: "20px",
              padding: "24px",
              borderRadius: "20px",
              background: "var(--gradient-glass)",
              backdropFilter: "blur(30px)",
              border: "1px solid var(--color-border)",
              zIndex: 1000,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "var(--color-text)",
                    marginBottom: "4px",
                  }}
                >
                  {selectedLocation.name},{" "}
                  {selectedLocation.country}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color:
                      "var(--color-text-secondary)",
                  }}
                >
                  {
                    selectedLocation.weather.weather[0]
                      .main
                  }
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "var(--color-accent)",
                    textShadow:
                      "0 0 20px rgba(0, 212, 255, 0.5)",
                  }}
                >
                  {Math.round(
                    selectedLocation.weather.main.temp
                  )}
                  °C
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color:
                      "var(--color-text-secondary)",
                  }}
                >
                  Feels like{" "}
                  {Math.round(
                    selectedLocation.weather.main
                      .feels_like
                  )}
                  °C
                </div>
              </div>
            </div>
          </motion.div>
        )}
    </motion.div>
  );
};

export default WeatherMap;
