/* ---------------- FOOTER DATES ---------------- */

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#lastModified").textContent = document.lastModified;



/* ---------------- WEATHER ---------------- */

/* Abuja Coordinates */

const lat = 9.0765;
const lon = 7.3986;

/* OpenWeatherMap API URL */

const weatherURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric&appid=d63c323e88ed73184e471fcf7dedf282";

/* Forecast URL */

const forecastURL =
"https://api.openweathermap.org/data/2.5/forecast?lat=" +
lat +
"&lon=" +
lon +
"&units=metric&appid=d63c323e88ed73184e471fcf7dedf282";



async function getWeather() {

    try {

        const response = await fetch(weatherURL);
        const data = await response.json();

        displayWeather(data);

    } catch (error) {
        console.log("Weather error:", error);
    }

}



function displayWeather(data) {

    document.querySelector("#temperature").textContent =
        Math.round(data.main.temp) + " °C";

    document.querySelector("#weather-description").textContent =
        data.weather[0].description;

}



getWeather();



/* ---------------- FORECAST ---------------- */

async function getForecast() {

    try {

        const response = await fetch(forecastURL);
        const data = await response.json();

        displayForecast(data);

    } catch (error) {
        console.log("Forecast error:", error);
    }

}



function displayForecast(data) {

    const forecastContainer = document.querySelector("#forecast-container");

    forecastContainer.innerHTML = "";

    /* Forecast every 24 hours (8 intervals) */

    for (let i = 0; i < data.list.length; i += 8) {

        if (i >= 24) break; // only 3 days

        const dayData = data.list[i];

        const card = document.createElement("div");

        const date = new Date(dayData.dt_txt);

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        card.innerHTML = `
        <p><strong>${dayName}</strong></p>
        <p>${Math.round(dayData.main.temp)} °C</p>
        `;

        forecastContainer.appendChild(card);

    }

}



getForecast();



/* ---------------- BUSINESS SPOTLIGHTS ---------------- */

const memberURL = "data/members.json";



async function getSpotlights() {

    const response = await fetch(memberURL);
    const data = await response.json();

    displaySpotlights(data.members);

}



function displaySpotlights(members) {

    const spotlightContainer =
        document.querySelector("#spotlight-container");

    /* filter Gold & Silver members */

    const qualifiedMembers = members.filter(
        member => member.membership === 2 || member.membership === 3
    );

    /* shuffle members randomly */

    const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());

    const selected = shuffled.slice(0, 3);



    selected.forEach(member => {

        const card = document.createElement("section");

        let membershipLabel = "";

        if (member.membership === 3) {
            membershipLabel = "Gold Member";
        } else {
            membershipLabel = "Silver Member";
        }

        card.innerHTML = `
        <h3>${member.name}</h3>

        <span class="badge level${member.membership}">
        ${membershipLabel}
        </span>

        <img src="images/${member.image}" alt="${member.name}">

        <p>${member.phone}</p>

        <a href="${member.website}" target="_blank">
        Visit Website
        </a>
        `;

        spotlightContainer.appendChild(card);

    });

}



getSpotlights();