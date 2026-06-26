const apiKey = "d418c9c389728893c25938910d415df0";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {

    document.getElementById("loading").innerText = "Searching...";

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Enter City Name");
        return;
    }

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();


          console.log(data);
          console.log(data.cod);

        if (data.cod != 200) {
            document.getElementById("loading").innerText = "";
            document.getElementById("error").innerText =
             "❌ City Not Found";
            return;
        }

        displayWeather(data);

        cityInput.value = "";

    } catch (error) {

        document.getElementById("loading").innerText = "";
document.getElementById("error").innerText =
"❌ Network Error";

        console.log(error);
    }
}

function displayWeather(data) {

    

    document.getElementById("loading").innerText = "";

    document.getElementById("city").innerText =
        data.name;

    document.getElementById("country").innerText =
        data.sys.country;

    document.getElementById("temperature").innerText =
        Math.round(data.main.temp) + "°C";

    document.getElementById("weather").innerText =
        data.weather[0].main;
        document.getElementById("feelsLike").innerText =
    Math.round(data.main.feels_like);

    document.getElementById("sunrise").innerText =
    new Date(data.sys.sunrise * 1000)
    .toLocaleTimeString([],{
    hour:"2-digit",
    minute:"2-digit"
    });
    
    document.getElementById("sunset").innerText =
    new Date(data.sys.sunset * 1000)
    .toLocaleTimeString([],{
    hour:"2-digit",
    minute:"2-digit"
    });

        document.getElementById("humidity").innerText =
        data.main.humidity;
    
    document.getElementById("wind").innerText =
        (data.wind.speed * 3.6).toFixed(1);

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("weatherIcon").alt =
        data.weather[0].description;
}



    window.onload = function () {
    cityInput.value = "Dhaka";
    getWeather();
};


function updateDateTime() {

    const now = new Date();

    document.getElementById("currentDate").innerText =
        now.toDateString();

    document.getElementById("currentTime").innerText =
        now.toLocaleTimeString();
}

updateDateTime();

setInterval(updateDateTime, 1000);


navigator.geolocation.getCurrentPosition(

    async function(position){

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        displayWeather(data);

    },

    function(){

        console.log("Location permission denied.");

    }

);