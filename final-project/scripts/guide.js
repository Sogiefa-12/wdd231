import { updateFooter, initHamburgerMenu } from './common.js';

updateFooter();
initHamburgerMenu();

const container = document.getElementById("food-guide-container");
const searchInput = document.getElementById("search-food");
const categoryFilter = document.getElementById("category-filter");

// Modal
const modal = document.getElementById("guide-modal");
const nameEl = document.getElementById("guide-food-name");
const imgEl = document.getElementById("guide-food-image");
const descEl = document.getElementById("guide-food-desc");
const favBtn = document.getElementById("guide-fav-btn");
const closeBtn = document.getElementById("guide-close-btn");

let foodsData = [];
let currentFood = null;

/* =========================
   LOAD DATA
========================= */
async function loadFoods() {
    try {
        const res = await fetch("./data/foods.json");
        const data = await res.json();

        foodsData = data.foods;
        displayFoods(foodsData);

    } catch (error) {
        console.error("Error loading foods:", error);
        container.innerHTML = "<p>Unable to load foods.</p>";
    }
}

/* =========================
   DISPLAY
========================= */
function displayFoods(foods) {
    container.innerHTML = "";

    foods.forEach(food => {
        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}" loading="lazy">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
            <small>Category: ${food.category}</small>
        `;

        card.addEventListener("click", () => openModal(food));

        container.appendChild(card);
    });
}

/* =========================
   FILTER
========================= */
function filterFoods() {
    const query = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = foodsData.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(query);
        const matchesCategory = category === "all" || food.category === category;

        return matchesSearch && matchesCategory;
    });

    displayFoods(filtered);
}

searchInput.addEventListener("input", filterFoods);
categoryFilter.addEventListener("change", filterFoods);

/* =========================
   MODAL
========================= */
function openModal(food) {
    currentFood = food;

    nameEl.textContent = food.name;
    imgEl.src = food.image;
    descEl.textContent = food.description;

    updateFavoriteButton();

    modal.showModal();
}

closeBtn.addEventListener("click", () => modal.close());

function updateFavoriteButton() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.some(f => f.name === currentFood.name);

    favBtn.textContent = exists
        ? "❌ Remove from Favorites"
        : "❤️ Add to Favorites";
}

/* =========================
   FAVORITES + SUCCESS MESSAGE
========================= */
favBtn.addEventListener("click", () => {
    if (!currentFood) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.some(f => f.name === currentFood.name);

    if (exists) {
        favorites = favorites.filter(f => f.name !== currentFood.name);
        showToast("Removed from favorites ❌");
    } else {
        favorites.push(currentFood);
        showToast("Added to favorites ❤️");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    updateFavoriteButton(); // refresh button state
});

/* =========================
   TOAST (SUCCESS MESSAGE)
========================= */
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

/* =========================
   HELPERS
========================= */
function isFavorite(food) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some(f => f.name === food.name);
}

/* =========================
   INIT
========================= */
loadFoods();