// src/components/MyPage/WeatherOverlay.jsx
import { useEffect, useContext } from "react";
import { WeatherContext } from "../WeatherContext";

function WeatherOverlay() {
  const {
    isRainy,
    isSnowy,
    isSunny,
    isCloudy,
    isThunder,
  } = useContext(WeatherContext);

  useEffect(() => {
    const container = document.getElementById("rain-overlay");
    if ((isRainy || isThunder) && container) {
      container.innerHTML = "";
      for (let i = 0; i < 80; i++) {
        const drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random().toFixed(2)}s`;
        drop.style.animationDuration = `${0.8 + Math.random()}s`;
        container.appendChild(drop);
      }
    } else if (container) {
      container.innerHTML = "";
    }
  }, [isRainy, isThunder]);

  useEffect(() => {
    const container = document.getElementById("snow-overlay");
    if (isSnowy && container) {
      container.innerHTML = "";
      for (let i = 0; i < 40; i++) {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.innerText = "❄";
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random().toFixed(2)}s`;
        flake.style.fontSize = `${8 + Math.random() * 8}px`;
        flake.style.opacity = "0.2";
        container.appendChild(flake);
      }
    } else if (container) {
      container.innerHTML = "";
    }
  }, [isSnowy]);

  return (
    <>
      {(isRainy || isThunder) && <div id="rain-overlay" className="rain-overlay" />}
      {isSnowy && <div id="snow-overlay" className="snow-overlay" />}
      {isSunny && <div className="weather-sunny-overlay" />}
      {isCloudy && <div className="weather-cloudy-overlay" />}
      {isThunder && <div className="weather-thunder-overlay" />}
    </>
  );
}

export default WeatherOverlay;
