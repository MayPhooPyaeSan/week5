import React, { useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

const API_KEY = "47a20d4c8cb990efbd9f921f5042cc46";

const weatherIconMap = {
  "clear sky": "CLEAR_DAY",
  "few clouds": "PARTLY_CLOUDY_DAY",
  "scattered clouds": "CLOUDY",
  "broken clouds": "CLOUDY",
  "shower rain": "RAIN",
  "rain": "RAIN",
  "moderate rain": "RAIN",
  "light rain": "RAIN",
  "thunderstorm": "THUNDERSTORM",
  "snow": "SNOW",
  "mist": "FOG",
  "fog": "FOG",
};

function getIcon(description) {
  const lower = description.toLowerCase();
  for (const key in weatherIconMap) {
    if (lower.includes(key)) return weatherIconMap[key];
  }
  return "CLEAR_DAY";
}

function formatDay() {
  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const day = days[now.getDay()];
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  return `${day} ${hours}:${mins}`;
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");

  function handleSearch(e) {
    e.preventDefault();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    axios.get(url)
      .then((response) => {
        const data = response.data;
        setWeather({
          city: data.name,
          tempC: Math.round(data.main.temp),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          wind: (data.wind.speed * 3.6).toFixed(1),
          icon: getIcon(data.weather[0].description),
        });
        setError("");
      })
      .catch(() => {
        setError("City not found. Please try again.");
        setWeather(null);
      });
  }

  function toF(c) {
    return Math.round((c * 9) / 5 + 32);
  }

  const displayTemp = weather
    ? unit === "C"
      ? weather.tempC
      : toF(weather.tempC)
    : null;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city"
          style={{ flex: 1, padding: "10px 14px", fontSize: 16, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: 4, fontSize: 16, cursor: "pointer" }}
        >
          Search
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2 style={{ margin: "0 0 4px" }}>{weather.city}</h2>
          <p style={{ margin: "0 0 4px", color: "#555" }}>{formatDay()}</p>
          <p style={{ margin: "0 0 20px", color: "#555", textTransform: "capitalize" }}>{weather.description}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <ReactAnimatedWeather
              icon={weather.icon}
              color="goldenrod"
              size={64}
              animate={true}
            />
            <span style={{ fontSize: 64, fontWeight: "300" }}>{displayTemp}</span>
            <div style={{ fontSize: 18, color: "#555" }}>
              <span
                onClick={() => setUnit("C")}
                style={{ cursor: "pointer", fontWeight: unit === "C" ? "bold" : "normal", color: unit === "C" ? "#000" : "#aaa" }}
              >
                °C
              </span>
              {" | "}
              <span
                onClick={() => setUnit("F")}
                style={{ cursor: "pointer", fontWeight: unit === "F" ? "bold" : "normal", color: unit === "F" ? "#000" : "#aaa" }}
              >
                °F
              </span>
            </div>
          </div>

          <p style={{ margin: "4px 0", color: "#555" }}>Humidity: {weather.humidity}%</p>
          <p style={{ margin: "4px 0", color: "#555" }}>Wind: {weather.wind} km/h</p>
        </div>
      )}

      <p style={{ marginTop: 40, fontSize: 13, color: "#888" }}>
        This project was coded by <strong>May Phoo Pyae San</strong> and is{" "}
        <a href="https://github.com/MayPhooPyaeSan/week5.git" target="_blank" rel="noreferrer">
          open-sourced on GitHub
        </a>{" "}
        and{" "}
        <a href="https://YOUR-SITE.netlify.app" target="_blank" rel="noreferrer">
          hosted on Netlify
        </a>
      </p>
    </div>
  );
}