/** @format */

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

const LocationList = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  // Debug environment variable
  console.log("Environment variable check:", {
    REACT_APP_WEATHER_API_KEY:
      process.env.REACT_APP_WEATHER_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      try {
        const apiKey =
          process.env.REACT_APP_WEATHER_API_KEY ||
          "Enter Your API Key here";
        console.log("Searching for:", query);
        console.log("API Key:", apiKey);

        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=5&appid=${apiKey}`;
        console.log("API URL:", url);

        const response = await fetch(url);
        console.log(
          "Response status:",
          response.status
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          const newSuggestions = Array.isArray(data)
            ? data
            : [];
          console.log(
            "Setting suggestions:",
            newSuggestions
          );
          setSuggestions(newSuggestions);
        } else {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          setSuggestions([]);
        }
      } catch (error) {
        console.error(
          "Error fetching suggestions:",
          error
        );
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(
      fetchSuggestions,
      300
    );
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (city) => {
    onSelect(city);
    setQuery("");
    setSuggestions([]);
    // Don't hide suggestions immediately to allow for better UX
  };

  return (
    <motion.div
      style={{
        position: "relative",
        marginBottom: "32px",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="glass-card"
        style={{
          padding: "32px",
          borderRadius: "28px",
          background: "var(--gradient-glass)",
          backdropFilter: "blur(30px)",
          border: "1px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "var(--shadow-lg)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "60px",
            height: "60px",
            background: "var(--gradient-neon)",
            borderRadius: "50%",
            opacity: 0.1,
            filter: "blur(15px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.h2
          style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "var(--color-accent)",
            marginBottom: "24px",
            textAlign: "center",
            textShadow:
              "0 0 30px rgba(0, 212, 255, 0.8)",
            letterSpacing: "-0.5px",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Search Location
        </motion.h2>

        <motion.div
          style={{ position: "relative" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a city..."
            className="search-input-ultra"
            style={{
              width: "100%",
              fontSize: "20px",
              padding: "24px 32px",
              borderRadius: "20px",
              border: "2px solid var(--color-border)",
              background: "var(--gradient-glass)",
              backdropFilter: "blur(30px)",
              color: "var(--color-text)",
              fontWeight: "500",
              letterSpacing: "-0.2px",
            }}
            whileFocus={{
              scale: 1.02,
              borderColor: "var(--color-accent)",
              boxShadow:
                "0 0 0 4px rgba(0, 212, 255, 0.1), var(--shadow-neon)",
            }}
            transition={{ duration: 0.3 }}
          />

          {loading && (
            <motion.div
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                border:
                  "2px solid var(--color-accent)",
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
          )}
        </motion.div>

        <AnimatePresence>
          {(suggestions.length > 0 || loading) && (
            <motion.div
              className="glass-card"
              style={{
                position: "relative",
                marginTop: "16px",
                padding: "16px",
                borderRadius: "20px",
                background: "var(--gradient-glass)",
                backdropFilter: "blur(30px)",
                border:
                  "1px solid var(--color-border)",
                zIndex: 9999,
                maxHeight: "300px",
                overflowY: "auto",
                boxShadow: "var(--shadow-lg)",
              }}
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    color:
                      "var(--color-text-secondary)",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Searching...
                </motion.div>
              ) : suggestions.length === 0 &&
                query.length >= 2 ? (
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    color:
                      "var(--color-text-secondary)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No cities found. Try a different
                  search term.
                </motion.div>
              ) : (
                suggestions.map((city, index) => (
                  <motion.div
                    key={`${city.name}-${city.country}-${city.lat}-${city.lon}`}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      marginBottom: "8px",
                      border: "1px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{
                      background:
                        "var(--color-glass-hover)",
                      borderColor:
                        "var(--color-accent)",
                      scale: 1.02,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(city)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "var(--color-text)",
                        marginBottom: "4px",
                      }}
                    >
                      {city.name}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color:
                          "var(--color-text-secondary)",
                        fontWeight: "500",
                      }}
                    >
                      {city.country} •{" "}
                      {city.state || ""}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default LocationList;
