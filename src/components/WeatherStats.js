/** @format */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function formatTime(ts, timezoneOffset) {
  const date = new Date((ts + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeUntil(ts, timezoneOffset) {
  const now = Date.now() / 1000;
  const event = ts + timezoneOffset;
  let diff = event - now;
  if (diff < 0) diff += 24 * 3600; // next day
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  return `${hours > 0 ? hours + "h " : ""}${mins}m`;
}

const WeatherStats = ({ city }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      setStats(null);
      try {
        if (!city?.lat || !city?.lon)
          throw new Error("No city selected");

        // Use the free current weather API instead of One Call API
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok)
          throw new Error(
            "Failed to fetch weather stats"
          );
        const data = await res.json();

        setStats({
          wind: data.wind?.speed || 0,
          rain: data.rain ? data.rain["1h"] || 0 : 0,
          pressure: data.main?.pressure || 0,
          uv: 0, // UV index not available in free API
          sunrise: data.sys?.sunrise || 0,
          sunset: data.sys?.sunset || 0,
          humidity: data.main?.humidity || 0,
          visibility: data.visibility || 0,
          timezone_offset: data.timezone || 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [city]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  if (loading) {
    return (
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "20px",
          width: "100%",
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="glass-card"
            style={{
              padding: "28px",
              borderRadius: "18px",
              background: "var(--gradient-glass)",
              backdropFilter: "blur(30px)",
              border: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "140px",
            }}
            variants={itemVariants}
          >
            <div
              className="loading-shimmer-ultra"
              style={{
                height: "24px",
                width: "70%",
                marginBottom: "20px",
              }}
            ></div>
            <div
              className="loading-shimmer-ultra"
              style={{
                height: "32px",
                width: "50%",
                marginBottom: "16px",
              }}
            ></div>
            <div
              className="loading-shimmer-ultra"
              style={{ height: "16px", width: "60%" }}
            ></div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="glass-card"
        style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--color-text-secondary)",
          borderRadius: "18px",
          background: "var(--gradient-glass)",
          backdropFilter: "blur(30px)",
          border: "1px solid var(--color-border)",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!stats) {
    return (
      <motion.div
        className="glass-card"
        style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--color-text-secondary)",
          borderRadius: "18px",
          background: "var(--gradient-glass)",
          backdropFilter: "blur(30px)",
          border: "1px solid var(--color-border)",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        No weather data available
      </motion.div>
    );
  }

  // 6 metrics in 3x2 grid layout (3 columns, 2 rows)
  const statItems = [
    {
      label: "UV INDEX",
      value: "N/A",
      sub: "Premium Feature",
      icon: "☀️",
    },
    {
      label: "SUN",
      value: formatTime(
        stats.sunrise,
        stats.timezone_offset
      ),
      sub: "Sunrise",
      icon: "🌅",
    },
    {
      label: "HUMIDITY",
      value: `${stats.humidity}%`,
      sub: "Relative",
      icon: "💧",
    },
    {
      label: "WIND",
      value: `${Math.round(stats.wind * 3.6)}`,
      sub: "km/h",
      icon: "💨",
    },
    {
      label: "AQ",
      value: "Good",
      sub: "Air Quality",
      icon: "🌬️",
    },
    {
      label: "PRECIPITATION",
      value: `${stats.rain}`,
      sub: "mm Last Hour",
      icon: "🌧️",
    },
  ];

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "20px",
        width: "100%",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={index}
          className="glass-card"
          style={{
            padding: "28px",
            borderRadius: "18px",
            background: "var(--gradient-glass)",
            backdropFilter: "blur(30px)",
            border: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            minHeight: "140px",
          }}
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            y: -10,
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            style={{
              fontSize: "40px",
              marginBottom: "20px",
              filter:
                "drop-shadow(0 0 15px rgba(0, 212, 255, 0.5))",
            }}
            whileHover={{
              scale: 1.3,
              filter:
                "drop-shadow(0 0 25px rgba(0, 212, 255, 0.8))",
              transition: { duration: 0.3 },
            }}
          >
            {stat.icon}
          </motion.div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--color-text-secondary)",
            }}
          >
            {stat.label}
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "8px",
              color: "var(--color-accent)",
              textShadow:
                "0 0 15px rgba(0, 212, 255, 0.7)",
              letterSpacing: "-0.8px",
            }}
          >
            {stat.value}
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--color-text-secondary)",
              opacity: 0.8,
            }}
          >
            {stat.sub}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default WeatherStats;
