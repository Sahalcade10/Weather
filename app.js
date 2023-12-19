window.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", searchWeatherByCountry);
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        function(error) {
          console.log("Geolocation error:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  });
  
  function fetchWeatherByCoordinates(latitude, longitude) {
    const apiKey = "800445f54c0e8c4c97aa54b0edab90be";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data for your location.");
        }
        return response.json();
      })
      .then(data => renderWeather(data))
      .catch(error => {
        console.log("API error:", error.message);
        displayErrorMessage("Failed to fetch weather data for your location.");
      });
  }
  
  function searchWeatherByCountry() {
    const countryInput = document.getElementById("countryInput");
    const countryName = countryInput.value.trim();
  
    if (countryName) {
      const apiKey = "800445f54c0e8c4c97aa54b0edab90be";
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        countryName)}&appid=${apiKey}`;
  
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch weather data for the specified country.");
          }
          return response.json();
        })
        .then(data => renderWeather(data))
        .catch(error => {
          console.log("API error:", error.message);
          displayErrorMessage("Failed to fetch weather data for the specified country.");
        });
    }
  }
  
  function renderWeather(data) {
    const weatherInfo = document.getElementById("weatherInfo");
    weatherInfo.innerHTML = "";
  
    const cityName = data.name;
    const country = data.sys.country;
    const temperature = data.main.temp;
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;
    const weatherDescription = data.weather[0].description;
  
    const unitSelect = document.getElementById("unitSelect");
    const selectedUnit = unitSelect.value;
  
    let convertedTemp;
    switch (selectedUnit) {
      case "metric":
        convertedTemp = temperature - 273.15; // Convert from Kelvin to Celsius
        break;
      case "imperial":
        convertedTemp = (temperature - 273.15) * 1.8 + 32; // Convert from Kelvin to Fahrenheit
        break;
      case "kelvin":
      default:
        convertedTemp = temperature; // Temperature already in Kelvin
        break;
    }
  
    const weatherElement = document.createElement("div");
    weatherElement.innerHTML = `
      <h2>${cityName}, ${country}</h2>
      <p>Temperature: ${convertedTemp.toFixed(2)} ${selectedUnit === "metric" ? "°C" : selectedUnit === "imperial" ? "°F" : "K"}</p>
      <p>Latitude:${latitude}, Longitude: ${longitude} </p>
      <p>Weather: ${weatherDescription}</p>
    `;
  
    weatherInfo.appendChild(weatherElement);
  }
  
  function displayErrorMessage(message) {
    const weatherInfo = document.getElementById("weatherInfo");
    weatherInfo.innerHTML = "";
  
    const errorElement = document.createElement("div");
    errorElement.classList.add("error-message");
    errorElement.textContent = message;
  
    weatherInfo.appendChild(errorElement);
  }