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
      const response = await fetch(weatherURL);
      if (!response.ok) {
        throw new Error('Location not found');
      }
      const data = await response.json();
      displayWeatherData(data);
    } catch (error) {
      displayError('Location not found');
    }
  });

  function displayWeatherData(data) {
    const { name, sys, weather, main, dt, coord } = data;
    const { country } = sys;
    const { description, icon } = weather[0];
    const { temp, feels_like } = main;
    const { lat, lon } = coord;

    const weatherHTML = `
      <h2>${name}, ${country}</h2>
      <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank">Click to view map</a>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p style="text-transform: capitalize;">${description}</p><br>
      <p>Current: ${temp.toFixed(2)}° F</p>
      <p>Feels like: ${feels_like.toFixed(2)}° F</p><br>
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
});



