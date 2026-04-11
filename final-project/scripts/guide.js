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

/* LOAD DATA */
async function loadFoods() {
    const res = await fetch("./data/foods.json");
    const data = await res.json();
    foodsData = data.foods;

    displayFoods(foodsData);
}

/* DISPLAY */
function displayFoods(foods) {
    container.innerHTML = "";

    foods.forEach(food => {
        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
            <small>Category: ${food.category}</small>
        `;

        card.addEventListener("click", () => openModal(food));

        container.appendChild(card);
    });
}

/* FILTER */
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

/* MODAL */
function openModal(food) {
    currentFood = food;

    nameEl.textContent = food.name;
    imgEl.src = food.image;
    descEl.textContent = food.description;

    if (isFavorite(food)) {
        favBtn.textContent = "❌ Remove from Favorites";
    } else {
        favBtn.textContent = "❤️ Add to Favorites";
    }

    modal.showModal();
}

closeBtn.addEventListener("click", () => modal.close());

/* FAVORITES */
favBtn.addEventListener("click", () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favorites.find(f => f.name === currentFood.name);

    if (exists) {
        favorites = favorites.filter(f => f.name !== currentFood.name);
        favBtn.textContent = "❤️ Add to Favorites";
    } else {
        favorites.push(currentFood);
        favBtn.textContent = "❌ Remove from Favorites";
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
});

function isFavorite(food) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some(f => f.name === food.name);
}

/* INIT */
loadFoods();
