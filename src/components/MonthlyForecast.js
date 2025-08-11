/** @format */

import React from "react";
import { useWeather } from "../hooks/useWeather";
import "./MonthlyForecast.css";

const MonthlyForecast = ({ city }) => {
  const { daily, loading, error } = useWeather(
    city.lat,
    city.lon
  );

  if (loading)
    return (
      <div className="forecast loading">
        Loading forecast...
      </div>
    );
  if (error)
    return (
      <div className="forecast error">{error}</div>
    );
  if (!daily) return null;

  return (
    <div className="monthly-forecast">
      <div className="grid-month">
        {daily.map((day) => {
          const date = new Date(day.dt * 1000);
          return (
            <div
              key={day.dt}
              className="forecast-day"
            >
              <div className="date">
                <span className="weekday">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
                <span className="day">
                  {date.getDate()}
                </span>
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />
              <div className="temps">
                <span className="high">
                  {Math.round(day.temp.max)}°
                </span>
                <span className="low">
                  {Math.round(day.temp.min)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyForecast;
