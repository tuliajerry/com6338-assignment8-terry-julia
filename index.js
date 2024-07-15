document.addEventListener('DOMContentLoaded', () => {
  const weatherApp = document.getElementById('weather-app');
  const weatherSection = document.getElementById('weather');
  const weatherForm = weatherApp.querySelector('form');
  const weatherInput = document.getElementById('weather-search');

  weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = weatherInput.value.trim();
    if (location) {
      fetchWeatherData(location);
    }
  });

  async function fetchWeatherData(location) {
    const apiKey = '0e0e21f3afcbca34775d8619ee15da31';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Location not found');
      }
      const data = await response.json();
      displayWeatherData(data);
    } catch (error) {
      displayError(error.message);
    }
  }

  function displayWeatherData(data) {
    const { name, sys, weather, main, dt, coord } = data;
    const weatherHTML = `
      <h2>${name}, ${sys.country}</h2>
      <a href="https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}" target="__BLANK">Click to view map</a>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
      <p style="text-transform: capitalize;">${weather[0].description}</p><br>
      <p>Current: ${main.temp}° F</p>
      <p>Feels like: ${main.feels_like}° F</p><br>
      <p>Last updated: ${new Date(dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
    `;
    weatherSection.innerHTML = weatherHTML;
    weatherInput.value = '';
  }

  function displayError(message) {
    const errorHTML = `<h2>${message}</h2>`;
    weatherSection.innerHTML = errorHTML;
    weatherInput.value = '';
  }
});

