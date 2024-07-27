const fetch = require("node-fetch");
const readline = require("readline");

const apiKey = "YOUR_API_KEY"; // Replace with your actual OpenWeatherMap API key

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getWeatherForCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === "200") {
        const forecasts =
          data && data.list.length > 0 && data.list.slice(0, 3 * 8); // Get forecasts for next 3 days (8 intervals per day)
        if (!forecasts || forecasts.length === 0) {
          throw new Error("Data not found");
        }
        for (let i = 0; i < forecasts.length; i += 8) {
          const date = new Date(forecasts[i].dt * 1000).toLocaleDateString();
          const temp = forecasts[i].main.temp;
          const description = forecasts[i].weather[0].description;
          const humidity = forecasts[i].main.humidity;
          const windSpeed = forecasts[i].wind.speed;

          console.log(`\n--- ${date} ---`);
          console.log(`Temperature: ${temp}°C`);
          console.log(`Description: ${description}`);
          console.log(`Humidity: ${humidity}%`);
          console.log(`Wind Speed: ${windSpeed} m/s`);
        }
      } else {
        console.error(`City not found or API error for ${city}.`);
      }
    })
    .catch((error) => {
      console.error(`Error fetching weather data for ${city}:`, error);
    })
    .finally(() => {
      askForAnotherCity();
    });
}

function askForAnotherCity() {
  rl.question('\nEnter another city or type "exit": ', (answer) => {
    if (answer.toLowerCase() === "exit") {
      rl.close();
    } else {
      getWeatherForCity(answer);
    }
  });
}

rl.question("Enter city name: ", getWeatherForCity);
