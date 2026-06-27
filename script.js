const apiKey = "d418c9c389728893c25938910d415df0";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const darkBtn = document.getElementById("darkBtn");

// Search Button
searchBtn.addEventListener("click", getWeather);

// Enter Key
cityInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});


// Search Weather


async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        error.innerText = "❌ Enter City Name";
        return;
    }

    loading.innerText = "Searching...";
    error.innerText = "";

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod != 200) {
            loading.innerText = "";
            error.innerText = "❌ City Not Found";
            return;
        }

        displayWeather(data);
        console.log("API Temperature:", data.main.temp);
        console.log(document.getElementById("temperature"));

        loading.innerText = "";
        error.innerText = "";

        cityInput.value = "";

    }

    catch (err) {

        loading.innerText = "";
        error.innerText = "❌ Network Error";

        console.log(err);

    }

}


// Display Weather


function displayWeather(data) {

    document.getElementById("city").innerText =
        data.name;

    document.getElementById("country").innerText =
        data.sys.country;

    document.getElementById("temperature").innerText =
    data.main.temp.toFixed(1) + "°C";

    document.getElementById("weather").innerText =
        data.weather[0].main;

    document.getElementById("feelsLike").innerText =
    data.main.feels_like.toFixed(1);

    document.getElementById("humidity").innerText =
        data.main.humidity;

    document.getElementById("wind").innerText =
        (data.wind.speed * 3.6).toFixed(1);

    document.getElementById("sunrise").innerText =
        new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("sunset").innerText =
        new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("weatherIcon").alt =
        data.weather[0].description;

}


// Date & Time


function updateDateTime() {

    const now = new Date();

    document.getElementById("currentDate").innerText =
        now.toDateString();

    document.getElementById("currentTime").innerText =
        now.toLocaleTimeString();

}

updateDateTime();

setInterval(updateDateTime, 1000);


// Default Weather


window.onload = function () {

    cityInput.value = "Dhaka";
    getWeather();

};


// Current Location Weather


function getLocationWeather() {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url =
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);
            const data = await response.json();

            displayWeather(data);

        },

        function () {

            console.log("Location Permission Denied");

        }

    );

}


// getLocationWeather();


// Dark Mode


darkBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        darkBtn.innerHTML = "☀️";

    }

    else {

        darkBtn.innerHTML = "🌙";

    }

});