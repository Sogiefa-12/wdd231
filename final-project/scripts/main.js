import { loadFoods, foodsData, openModal } from "./foods.mjs";

const recommendedFoodsContainer = document.getElementById("recommended-foods");
const userLocationEl = document.getElementById("user-location");

/* =========================
   REVERSE GEOCODING
========================= */
async function getCityFromCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();

        const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown City";

        const country = data.address.country || "Unknown Country";

        return `${city}, ${country}`;
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        return "Unknown Location";
    }
}

/* =========================
   RECOMMEND FOODS
========================= */
function recommendFoods(temp) {
    recommendedFoodsContainer.innerHTML = "";

    const tempBased =
        temp > 30
            ? ["Moi Moi", "Boli & Groundnut", "Akara"]
            : temp < 25
            ? ["Pepper Soup", "Jollof Rice", "Pounded Yam & Egusi"]
            : ["Suya", "Fried Rice"];

    tempBased.forEach(name => {
        const food = foodsData.find(f => f.name === name);
        if (!food) return;

        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}" loading="lazy">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
        `;

        card.addEventListener("click", () => openModal(food));

        recommendedFoodsContainer.appendChild(card);
    });
}

/* =========================
   INIT APP
========================= */
async function init() {
    await loadFoods();

    if (!navigator.geolocation) {
        userLocationEl.textContent = "Geolocation is not supported.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const locationName = await getCityFromCoords(lat, lon);
            userLocationEl.textContent = `📍 ${locationName}`;

            const apiKey = "YOUR_API_KEY_HERE"; // ⚠️ move to config if possible

            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();

                const tempValue = data.main.temp;

                const tempEl = document.getElementById("temp");
                const descEl = document.getElementById("desc");
                const weatherIcon = document.getElementById("weather-icon");

                tempEl.textContent = `Temperature: ${tempValue.toFixed(1)}°C`;
                descEl.textContent = `Weather: ${data.weather[0].description}`;

                // ✅ FIX: Only set src when available (prevents validation issue)
                weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                weatherIcon.alt = data.weather[0].description;

                weatherIcon.classList.remove("hidden");

                recommendFoods(tempValue);
            } catch (err) {
                console.error("Weather API error:", err);
                userLocationEl.textContent += " (Weather unavailable)";
            }
        },
        () => {
            userLocationEl.textContent = "Unable to retrieve your location.";
        }
    );
}

init();

/* =========================
   MENU TOGGLE
========================= */
const menuButton = document.getElementById("menu");
const nav = document.querySelector(".navigation");

if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
        nav.classList.toggle("open");
        menuButton.classList.toggle("open");
    });
}

/* =========================
   FOOTER
========================= */
const year = document.getElementById("year");
const lastModified = document.getElementById("lastModified");

if (year) year.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;