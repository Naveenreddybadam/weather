const apiKey = "6de4a4fac23868467a5b1b5d6b803b99"; // Get from https://openweathermap.org/api

function updateBackground(weather) {
    let body = document.body;

    if (weather.includes("clear")) {
        body.style.backgroundImage = "url('images/clear.jpg')";
    } else if (weather.includes("cloud")) {
        body.style.backgroundImage = "url('images/clouds.jpg')";
    } else if (weather.includes("rain")) {
        body.style.backgroundImage = "url('images/rain.jpg')";
    } else if (weather.includes("snow")) {
        body.style.backgroundImage = "url('images/snow.jpg')";
    } else if (weather.includes("mist") || weather.includes("fog")) {
        body.style.backgroundImage = "url('images/mist.jpg')";
    } else {
        body.style.backgroundImage = "url('images/default.jpg')";
    }

    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                document.getElementById("weatherResult").innerHTML = "<p>City not found!</p>";
                return;
            }

            const weatherCondition = data.weather[0].description.toLowerCase();
            updateBackground(weatherCondition);

            const temp = data.main.temp;
            const feelsLike = data.main.feels_like;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const pressure = data.main.pressure;
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            // For UV Index (need lat & lon)
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`)
                .then(res => res.json())
                .then(uvData => {
                    const uvIndex = uvData.value;

                    document.getElementById("weatherResult").innerHTML = `
                        <h2>${data.name}, ${data.sys.country}</h2>
                        <p>🌡 Temperature: ${temp}°C</p>
                        <p>🤗 Real Feel: ${feelsLike}°C</p>
                        <p>💧 Humidity: ${humidity}%</p>
                        <p>🌬 Wind Speed: ${windSpeed} m/s</p>
                        <p>☁ Weather: ${weatherCondition}</p>
                        <p>📏 Pressure: ${pressure} hPa</p>
                        <p>🌇 Sunset: ${sunset}</p>
                        <p>🔆 UV Index: ${uvIndex}</p>
                    `;
                });
        })
        .catch(error => console.error("Error fetching weather data:", error));
}
