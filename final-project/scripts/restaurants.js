// restaurants.js

import { updateFooter, initHamburgerMenu } from './common.js';

/* =========================
   INIT SHARED FEATURES
========================= */
updateFooter();
initHamburgerMenu();

/* =========================
   DOM ELEMENTS
========================= */
const container = document.getElementById("restaurants-container");
const userLocationEl = document.getElementById("user-location");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// Modal elements
const modal = document.getElementById("restaurant-modal");
const modalName = document.getElementById("modal-restaurant-name");
const modalCity = document.getElementById("modal-restaurant-city");
const modalFoods = document.getElementById("modal-restaurant-foods");
const modalMap = document.getElementById("modal-restaurant-map");
const favoriteBtn = document.getElementById("restaurant-favorite-btn");
const closeModalBtn = document.getElementById("close-restaurant-modal");

/* =========================
   GLOBAL DATA
========================= */
let restaurantsData = [];
let currentRestaurant = null;

/* =========================
   LOAD DATA
========================= */
export async function loadRestaurants() {
    try {
        const response = await fetch("./data/restaurants.json");

        if (!response.ok) throw new Error("Failed to load JSON");

        const data = await response.json();
        restaurantsData = data.restaurants;

        displayRestaurants(restaurantsData);

    } catch (error) {
        console.error("Error loading restaurants:", error);
        container.innerHTML = "<p>Unable to load restaurants at this time.</p>";
    }
}

/* =========================
   REVERSE GEOCODING
========================= */
async function getCityFromCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );

        const data = await response.json();

        const area =
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.city_district ||
            "";

        const city =
            data.address.city ||
            data.address.town ||
            data.address.state ||
            "";

        const country = data.address.country || "";

        return `${area ? area + ", " : ""}${city}, ${country}`;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return "Unknown Location";
    }
}

/* =========================
   DISTANCE CALCULATION
========================= */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* =========================
   DISPLAY RESTAURANTS
========================= */
function displayRestaurants(restaurants) {
    container.innerHTML = "";

    if (!restaurants.length) {
        container.innerHTML = "<p>No restaurants found.</p>";
        return;
    }

    restaurants.forEach(rest => {
        const card = document.createElement("div");
        card.className = "food-card";

        let badge = "";
        if (rest.rating >= 4.7) {
            badge = `<span class="badge top">Top Rated</span>`;
        } else if (rest.distance && rest.distance < 2) {
            badge = `<span class="badge near">Nearby</span>`;
        }

        card.innerHTML = `
            <img src="${rest.image}" alt="${rest.name}">
            <div class="card-content">
                ${badge}
                <h3>${rest.name}</h3>
                <p><strong>City:</strong> ${rest.city}</p>
                <p>⭐ ${rest.rating}</p>
                ${rest.distance ? `<p>📍 ${rest.distance.toFixed(1)} km away</p>` : ""}
            </div>
        `;

        card.addEventListener("click", () => openRestaurantModal(rest));
        container.appendChild(card);
    });
}

/* =========================
   MODAL
========================= */
function openRestaurantModal(rest) {
    currentRestaurant = rest;

    modalName.textContent = rest.name;
    modalCity.textContent = `📍 ${rest.city}`;
    modalFoods.textContent = `🍽️ ${rest.foods.join(", ")}`;

    // 🗺️ Google Maps Link
    modalMap.href = `https://www.google.com/maps?q=${rest.lat},${rest.lon}`;
    modalMap.target = "_blank";

    // ❤️ Favorite button state
    if (isFavorite(rest)) {
        favoriteBtn.textContent = "❌ Remove from Favorites";
    } else {
        favoriteBtn.textContent = "❤️ Save Restaurant";
    }

    modal.classList.add("show");
    modal.showModal();
    
}

closeModalBtn.addEventListener("click", () =>
    modal.classList.remove("show") ||
    modal.close());

/* =========================
   FAVORITES
========================= */
favoriteBtn.addEventListener("click", () => {
    let favorites = JSON.parse(localStorage.getItem("restaurantFavorites")) || [];

    if (!currentRestaurant) return;

    const exists = favorites.find(r => r.name === currentRestaurant.name);

    if (exists) {
        favorites = favorites.filter(r => r.name !== currentRestaurant.name);
        localStorage.setItem("restaurantFavorites", JSON.stringify(favorites));
        favoriteBtn.textContent = "❤️ Save Restaurant";
        alert("Removed from favorites ❌");
    } else {
        favorites.push(currentRestaurant);
        localStorage.setItem("restaurantFavorites", JSON.stringify(favorites));
        favoriteBtn.textContent = "❌ Remove from Favorites";
        alert("Saved to favorites ❤️");
    }
});

function isFavorite(rest) {
    const favorites = JSON.parse(localStorage.getItem("restaurantFavorites")) || [];
    return favorites.some(r => r.name === rest.name);
}

/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    const filtered = restaurantsData.filter(rest =>
        rest.city.toLowerCase().includes(query) ||
        rest.foods.some(food => food.toLowerCase().includes(query))
    );

    displayRestaurants(filtered);
});

/* =========================
   SORT
========================= */
sortSelect.addEventListener("change", () => {

    if (sortSelect.value === "rating") {
        restaurantsData.sort((a, b) => b.rating - a.rating);
    } else {
        restaurantsData.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    displayRestaurants(restaurantsData);
});

/* =========================
   INIT
========================= */
function init() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(async (pos) => {

            const userLat = pos.coords.latitude;
            const userLon = pos.coords.longitude;

            // ✅ Human-readable location
            const locationName = await getCityFromCoords(userLat, userLon);
            userLocationEl.textContent = `Your Location: ${locationName}`;

            await loadRestaurants();

            restaurantsData.forEach(rest => {
                rest.distance = calculateDistance(
                    userLat,
                    userLon,
                    rest.lat,
                    rest.lon
                );
            });

            restaurantsData.sort((a, b) => a.distance - b.distance);

            displayRestaurants(restaurantsData);

        }, () => {
            userLocationEl.textContent = "Unable to detect location.";
            loadRestaurants();
        });

    } else {
        userLocationEl.textContent = "Geolocation not supported.";
        loadRestaurants();
    }
}

init();