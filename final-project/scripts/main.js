// import { loadFoods } from "./foods.mjs";


// const year = document.getElementById("year");
// const lastModified = document.getElementById("lastModified");

// if (year) {
//     year.textContent = new Date().getFullYear();
// }

// if (lastModified) {
//     lastModified.textContent = document.lastModified;
// }

// /* Menu Toggle */
// const menuButton = document.getElementById("menu");
// const nav = document.querySelector(".navigation");

// menuButton.addEventListener("click", () => {
//     nav.classList.toggle("open");
//     menuButton.classList.toggle("open");
// });


// /* Load Foods on Page Load */
// loadFoods();


// /* Geolocation */

// const locationInfo = document.getElementById("location-info");

// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             const lat = position.coords.latitude;
//             const lon = position.coords.longitude;

//             getCity(lat, lon);
//         },
//         () => {
//             locationInfo.textContent = "Unable to retrieve your location.";
//         }
//     );
// } else {
//     locationInfo.textContent = "Geolocation is not supported by your browser.";
// }


// /* Weather (OpenWeatherMap API) */

// const temp = document.getElementById("temp");
// const desc = document.getElementById("desc");
// const weatherIcon = document.getElementById("weather-icon");

// const apiKey = "d63c323e88ed73184e471fcf7dedf282";

// async function getWeather(lat = 9.08, lon = 7.49) {
//     try {
//         const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
//         const response = await fetch(url);
//         const data = await response.json();

//         temp.textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
//         desc.textContent = `Weather: ${data.weather[0].description}`;

//         // show weather icon
//         const iconCode = data.weather[0].icon;
//         weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
//         weatherIcon.alt = data.weather[0].description;
//         weatherIcon.style.display = "inline-block";

//     } catch (error) {
//         temp.textContent = "Unable to fetch weather data.";
//         console.error("Error fetching weather data:", error);
//     }
// }


// // Default to a specific location if geolocation fails
// getWeather();


// async function getCity(lat, lon) {
//     try {
//         const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//         );

//         const data = await response.json();

//         const city =
//             data.address.city ||
//             data.address.town ||
//             data.address.village ||
//             data.address.state;

//         const country = data.address.country;

//         locationInfo.textContent = `${city}, ${country}`;
//     } catch (error) {
//         locationInfo.textContent = "Location detected, but unable to get city name.";
//         console.error(error);
//     }
// }




import { loadFoods, foodsData } from "./foods.mjs";

const recommendedFoodsContainer = document.getElementById("recommended-foods");
const userLocationEl = document.getElementById("user-location");

async function getCityFromCoords(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || "Unknown City";
        const country = data.address.country || "Unknown Country";
        return `${city}, ${country}`;
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return "Unknown Location";
    }
}

function recommendFoods(temp) {
    recommendedFoodsContainer.innerHTML = "";

    const tempBased = temp > 30 ? ["Moi Moi", "Boli & Groundnut", "Akara"]
                     : temp < 25 ? ["Pepper Soup", "Jollof Rice", "Egusi Soup"]
                     : ["Suya", "Fried Rice"];

    tempBased.forEach(name => {
        const food = foodsData.find(f => f.name === name);
        if (!food) return;

        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
        `;
        recommendedFoodsContainer.appendChild(card);
    });
}

async function init() {
    await loadFoods(); // ensure foodsData is populated

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const locationName = await getCityFromCoords(lat, lon);
            userLocationEl.textContent = `Your Location: ${locationName}`;

            // Fetch weather
            const apiKey = "d63c323e88ed73184e471fcf7dedf282";
            
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();
                const tempValue = data.main.temp;

                const temp = document.getElementById("temp");
                const desc = document.getElementById("desc");
                const weatherIcon = document.getElementById("weather-icon");

                temp.textContent = `Temperature: ${tempValue.toFixed(1)}°C`;
                desc.textContent = `Weather: ${data.weather[0].description}`;
                weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                weatherIcon.alt = data.weather[0].description;
                weatherIcon.style.display = "inline";

                recommendFoods(tempValue);
            } catch (err) {
                console.error("Weather API error:", err);
                userLocationEl.textContent += " (Unable to fetch weather data)";
            }
        }, () => {
            userLocationEl.textContent = "Unable to retrieve your location.";
        });
    } else {
        userLocationEl.textContent = "Geolocation is not supported by your browser.";
    }
}

init();

 /* Menu Toggle */
 const menuButton = document.getElementById("menu");
 const nav = document.querySelector(".navigation");

 menuButton.addEventListener("click", () => {
     nav.classList.toggle("open");
     menuButton.classList.toggle("open");
 });

const year = document.getElementById("year");
const lastModified = document.getElementById("lastModified");

 if (year) {
     year.textContent = new Date().getFullYear();
 }

 if (lastModified) {
     lastModified.textContent = document.lastModified;
 }