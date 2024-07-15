document.addEventListener('DOMContentLoaded', () => {
  const weatherForm = document.querySelector('form');
  const weatherInput = document.querySelector('#weather-search');
  const weatherSection = document.querySelector('#weather');

  const apiKey = '0e0e21f3afcbca34775d8619ee15da31';

  weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = weatherInput.value.trim();
    if (!query) return;

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=${apiKey}`;

    try {
      console.log(`Fetching weather data for: ${query}`);
      const response = await fetch(weatherURL);
      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
        throw new Error('Location not found');
      }
      const data = await response.json();
      console.log('Weather data:', data);
      displayWeatherData(data);
      clearError();
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      displayError('Location not found');
    }
  });

  function displayWeatherData(data) {
    const { name, sys, weather, main, dt, coord } = data;
    const { country } = sys;
    const { description, icon } = weather[0];
    const { temp, feels_like } = main;
    const { lat, lon } = coord;

    console.log('Data to display:', { name, country, description, icon, temp, feels_like, lat, lon, dt });

    const weatherHTML = `
      <h2>${name}, ${country}</h2>
      <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank">Click to view map</a>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p style="text-transform: capitalize;">${description}</p>
      <p>Current: ${temp.toFixed(2)}° F</p>
      <p>Feels like: ${feels_like.toFixed(2)}° F</p>
      <p>Last updated: ${new Date(dt * 1000).toLocaleTimeString()}</p>
    `;
    weatherSection.innerHTML = weatherHTML;
    weatherSection.style.display = 'block';
    weatherInput.value = '';
  }

  function displayError(message) {
    const errorHTML = `<p class="error">${message}</p>`;
    weatherSection.innerHTML = errorHTML;
    weatherSection.style.display = 'block';
    weatherInput.value = '';
  }

  function clearError() {
    const errorElement = weatherSection.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
    }
  }
});





