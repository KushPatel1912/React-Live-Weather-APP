import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weather-favorites');
    const savedRecents = localStorage.getItem('weather-recents');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedRecents) {
      setRecents(JSON.parse(savedRecents));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('weather-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weather-recents', JSON.stringify(recents));
  }, [recents]);

  const addToFavorites = (city) => {
    const cityKey = `${city.name}-${city.country}`;
    const exists = favorites.some(fav => `${fav.name}-${fav.country}` === cityKey);
    
    if (!exists) {
      setFavorites(prev => [...prev, city]);
    }
  };

  const removeFromFavorites = (city) => {
    const cityKey = `${city.name}-${city.country}`;
    setFavorites(prev => prev.filter(fav => `${fav.name}-${fav.country}` !== cityKey));
  };

  const addToRecents = (city) => {
    const cityKey = `${city.name}-${city.country}`;
    setRecents(prev => {
      // Remove if already exists
      const filtered = prev.filter(recent => `${recent.name}-${recent.country}` !== cityKey);
      // Add to beginning
      return [city, ...filtered.slice(0, 9)]; // Keep max 10 recents
    });
  };

  const toggleFavorite = (city) => {
    const cityKey = `${city.name}-${city.country}`;
    const isFavorite = favorites.some(fav => `${fav.name}-${fav.country}` === cityKey);
    
    if (isFavorite) {
      removeFromFavorites(city);
    } else {
      addToFavorites(city);
    }
  };

  const isFavorite = (city) => {
    const cityKey = `${city.name}-${city.country}`;
    return favorites.some(fav => `${fav.name}-${fav.country}` === cityKey);
  };

  const value = {
    favorites,
    recents,
    addToFavorites,
    removeFromFavorites,
    addToRecents,
    toggleFavorite,
    isFavorite,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext; 