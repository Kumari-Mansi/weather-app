const API_KEY = '3c1e0502b2009e29e8dd0298c0021092';
const cityName = document.getElementById("cityName");
const secondDiv = document.getElementById("secondDiv");

// Fetch weather by city
async function fetchData(city) {
  try {
    if (!city.trim()) {
      secondDiv.innerHTML = "<h2>Please enter a city name</h2>";
      return;
    }

    secondDiv.innerHTML = "<h3>Fetching weather...</h3>";

    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    let result = await res.json();

    if (result.cod !== 200) {
      secondDiv.innerHTML = `<h2>${result.message}</h2>`;
      return;
    }

    displayWeather(result);
    cityName.value = "";
  } catch (err) {
    secondDiv.innerHTML = "<h2>Something went wrong. Try again!</h2>";
    console.log(err.message);
  }
}

// Display weather data
function displayWeather({ name, main, wind, weather }) {
  let div = `
    <div id="weatherInfo">
      <p id="temp">${main.temp}°C</p>
      <p id="city">${name}</p>
      <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt="weather icon">
      <p>${weather[0].description}</p>
    </div>

    <div id="otherInfo">
      <div class="wind">
        <p class="value">${wind.speed} Km/h</p>
        <p>Wind Speed</p>
      </div>
      <div class="wind">
        <p class="value">${main.pressure} mb</p>
        <p>Pressure</p>
      </div>
      <div class="wind">
        <p class="value">${main.humidity}%</p>
        <p>Humidity</p>
      </div>
    </div>
  `;

  secondDiv.innerHTML = div;
}

// Event listeners
document.getElementById("searchBtn").addEventListener('click', () => {
  fetchData(cityName.value);
});

document.getElementById("currLocBtn").addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let lati = position.coords.latitude;
    let longi = position.coords.longitude;
    fetchDataByCoordinates(lati, longi);
  });
});

// Fetch weather by coordinates
async function fetchDataByCoordinates(lati, longi) {
  try {
    secondDiv.innerHTML = "<h3>Fetching weather...</h3>";

    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${API_KEY}&units=metric`);
    let result = await res.json();

    if (result.cod !== 200) {
      secondDiv.innerHTML = `<h2>${result.message}</h2>`;
      return;
    }

    displayWeather(result);
  } catch (err) {
    secondDiv.innerHTML = "<h2>Unable to fetch location weather</h2>";
    console.log(err.message);
  }
}
