const apiKey = '0e0e21f3afcbca34775d8619ee15da31';

async function fetchWeatherData(latitude, longitude) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function updateWeatherInfo(weatherData) {
  const weatherSection = document.getElementById('weather');

  if (!weatherData || weatherData.cod !== 200) {
    weatherSection.innerHTML = '<h2>Location not found</h2>';
    return;
  }

  const { name, sys, weather, main, dt, coord } = weatherData;
  const { country } = sys;
  const { description, icon } = weather[0];
  const { temp, feels_like } = main;

  const weatherIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}`;
  const updatedTime = new Date(dt * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  weatherSection.innerHTML = `
    <h2>${name}, ${country}</h2>
    <a href="${mapLink}" target="_blank">Click to view map</a>
    <img src="${weatherIconUrl}" alt="${description} icon">
    <p style="text-transform: capitalize;">${description}</p><br>
    <p>Current: ${temp}° F</p>
    <p>Feels like: ${feels_like}° F</p><br>
    <p>Last updated: ${updatedTime}</p>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const weatherForm = document.getElementById('weather-form');
  const inputField = document.querySelector('input[name="search"]');

  weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const location = inputField.value.trim();
    if (!location) return;

    try {
  
      const coordinates = await fetchCoordinates(location);
      const { latitude, longitude } = coordinates;

      const weatherData = await fetchWeatherData(latitude, longitude);
      updateWeatherInfo(weatherData);

     
      inputField.value = '';
    } catch (error) {
      console.error('Error processing weather data:', error);
    }
  });
});

async function fetchCoordinates(location) {
  const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

  try {
    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const { coord } = data;
    if (!coord) {
      throw new Error(`Coordinates not found for location: ${location}`);
    }

    return coord;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
}




