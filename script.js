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
        getForecast(data.coord.lat, data.coord.lon);
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

       
        changeBackground(data.weather[0].main);    


        

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

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

        darkBtn.innerHTML = "☀️";

    }

    else {

        darkBtn.innerHTML = "🌙";

    }

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

        localStorage.setItem("theme", "dark");

    }

    else {

        darkBtn.innerHTML = "🌙";

        localStorage.setItem("theme", "light");

    }

});

function changeBackground(weather){

    rainContainer.style.display="none";

    const body = document.body;

    const sun = document.querySelector(".sun");

    const clouds = document.querySelectorAll(".cloud");
    const rain = document.querySelector(".rain");
    //  hide 
    sun.style.display = "none";

    clouds.forEach(cloud=>{
        cloud.style.display = "none";
    });

    if(rain){

        rain.style.display="none";
    
    }

    body.classList.remove(
        "clear-bg",
        "cloud-bg",
        "rain-bg",
        "snow-bg",
        "storm-bg",
        "mist-bg",
        "default-bg"
    );

    switch (weather) {

        case "Clear":

    body.classList.add("clear-bg");

    sun.style.display = "block";

    break;

    case "Clouds":

    body.classList.add("cloud-bg");

    clouds.forEach(cloud=>{
        cloud.style.display = "block";
    });

    break;

    case "Rain":
        case "Drizzle":
        
            body.classList.add("rain-bg");
            rainContainer.style.display="block";
        
            if(rain){
        
                rain.style.display="block";
        
            }
        
            clouds.forEach(cloud=>{
                cloud.style.display="block";
            });
        
            break;

        case "Snow":
            body.classList.add("snow-bg");
            break;

        case "Thunderstorm":
            body.classList.add("storm-bg");
            break;

        case "Mist":
        case "Fog":
        case "Haze":
            body.classList.add("mist-bg");
            break;

        default:
            body.classList.add("default-bg");
    }
}


async function getForecast(lat, lon) {

    const url =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    displayForecast(data);

}




function displayForecast(data) {

    const forecast =
    document.getElementById("forecast");

    forecast.innerHTML = "";

    const days = {};

    data.list.forEach(item => {

        const date =
        item.dt_txt.split(" ")[0];

        if(!days[date]){

            days[date] = item;

        }

    });

    Object.values(days)
    .slice(0,5)
    .forEach(item=>{

        const day =
        new Date(item.dt_txt)
        .toLocaleDateString("en-US",{
            weekday:"short"
        });

        forecast.innerHTML += `
        
        <div class="forecast-card">

            <h4>${day}</h4>

            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">

            <p>${Math.round(item.main.temp)}°C</p>

        </div>

        `;

    });


    function createRain(){

        const rain=document.querySelector(".rain");
    
        rain.innerHTML="";
    
        for(let i=0;i<180;i++){
    
            const drop=document.createElement("div");
    
            drop.classList.add("drop");
    
            drop.style.left=Math.random()*100+"vw";
    
            drop.style.animationDuration=
            .5+Math.random()*.6+"s";
    
            drop.style.animationDelay=
            Math.random()*2+"s";
    
            drop.style.opacity=
            Math.random();
    
            rain.appendChild(drop);
    
        }
    
    }
    
    createRain();

}


const rainContainer =
document.getElementById("rain");

function createRain(){

    rainContainer.innerHTML="";

    for(let i=0;i<450;i++){

        const drop =
        document.createElement("div");

        drop.classList.add("drop");

        drop.style.left =
        Math.random()*100+"vw";

        drop.style.height =
        10+Math.random()*25+"px";

        drop.style.animationDuration =
        .5+Math.random()*1+"s";

        drop.style.animationDelay =
        Math.random()*2+"s";

        drop.style.opacity =
        .2+Math.random()*.8;

        rainContainer.appendChild(drop);

    }

}

createRain();