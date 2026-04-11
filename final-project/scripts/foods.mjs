
// foods.mjs

const container = document.getElementById("featured-container");
const modal = document.getElementById("food-modal");
const foodName = document.getElementById("food-name");
const foodImage = document.getElementById("food-image");
const foodDescription = document.getElementById("food-description");
const closeModal = document.getElementById("close-modal");
const favoriteBtn = document.getElementById("favorite-btn");

// Exported array to be used in main.js
let foodsData = [];

export async function loadFoods() {
    try {
        const response = await fetch("./data/foods.json");
        const data = await response.json();
        foodsData = data.foods; // populate exported array
        displayFoods(foodsData);
    } catch (error) {
        console.error("Error loading foods:", error);
    }
}

function displayFoods(foods) {
    container.innerHTML = "";

    const featured = foods.slice(0, 4);
    featured.forEach(food => {
        const card = document.createElement("div");
        card.classList.add("food-card");

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}" loading="lazy">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
        `;

        card.addEventListener("click", () => openModal(food));
        container.appendChild(card);
    });
}

/* =========================
   MODAL
========================= */

let currentFood = null;

export function openModal(food) {
    currentFood = food;
    foodName.textContent = food.name;
    foodImage.src = food.image;
    foodImage.alt = food.name;
    foodDescription.textContent = food.description;

     if (isFavorite(food)) {
        favoriteBtn.textContent = "❌ Remove from Favorites";
    } else {
        favoriteBtn.textContent = "❤️ Add to Favorites";
    }


    modal.showModal();

    modal.classList.remove("closing");
}

closeModal.addEventListener("click", () => { 
    modal.classList.add("closing");

    setTimeout(() => {
        modal.close();
    }, 200); // Match this duration with the CSS transition time
});


favoriteBtn.addEventListener("click", () => {
    if (!currentFood) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.find(f => f.name === currentFood.name);

    if (exists) {
        // Remove
        favorites = favorites.filter(f => f.name !== currentFood.name);
        favoriteBtn.textContent = "❤️ Add to Favorites";
        alert("Removed from favorites ❌");
    } else {
        // Add
        favorites.push(currentFood);
        favoriteBtn.textContent = "❌ Remove from Favorites";
        alert("Added to favorites ❤️");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
});

function isFavorite(food) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some(f => f.name === food.name);
}

export { foodsData };