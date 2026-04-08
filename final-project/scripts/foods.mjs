// const container = document.getElementById("featured-container");

// // Modal elements
// const modal = document.getElementById("food-modal");
// const foodName = document.getElementById("food-name");
// const foodImage = document.getElementById("food-image");
// const foodDescription = document.getElementById("food-description");
// const closeModal = document.getElementById("close-modal");
// const favoriteBtn = document.getElementById("favorite-btn");

// let currentFood = null;

// export async function loadFoods() {
//     try {
//         const response = await fetch("./data/foods.json");
//         const data = await response.json();
//         displayFoods(data.foods);
//     } catch (error) {
//         console.error("Error loading foods:", error);
//     }
// }

// function displayFoods(foods) {
//     container.innerHTML = "";

//     const featured = foods.slice(0, 4);

//     featured.forEach(food => {
//         const card = document.createElement("div");
//         card.classList.add("food-card");

//         card.innerHTML = `
//             <img src="${food.image}" alt="${food.name}">
//             <h3>${food.name}</h3>
//             <p>${food.description}</p>
//         `;

//         // 👉 Click event
//         card.addEventListener("click", () => openModal(food));

//         container.appendChild(card);
//     });
// }

// /* =========================
//    MODAL FUNCTION
// ========================= */
// function openModal(food) {
//     currentFood = food;

//     foodName.textContent = food.name;
//     foodImage.src = food.image;
//     foodImage.alt = food.name;
//     foodDescription.textContent = food.description;

//     modal.showModal();
// }

// /* =========================
//    CLOSE MODAL
// ========================= */
// closeModal.addEventListener("click", () => {
//     modal.close();
// });

// /* =========================
//    FAVORITES (localStorage)
// ========================= */
// favoriteBtn.addEventListener("click", () => {
//     let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//     // Avoid duplicates
//     if (!favorites.find(f => f.name === currentFood.name)) {
//         favorites.push(currentFood);
//         localStorage.setItem("favorites", JSON.stringify(favorites));
//         alert("Added to favorites ❤️");
//     } else {
//         alert("Already in favorites 😉");
//     }
// });





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
            <img src="${food.image}" alt="${food.name}">
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
function openModal(food) {
    foodName.textContent = food.name;
    foodImage.src = food.image;
    foodImage.alt = food.name;
    foodDescription.textContent = food.description;
    modal.showModal();
}

closeModal.addEventListener("click", () => modal.close());

/* =========================
   FAVORITES
========================= */
favoriteBtn.addEventListener("click", () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const currentFood = {
        name: foodName.textContent,
        image: foodImage.src,
        description: foodDescription.textContent
    };
    if (!favorites.find(f => f.name === currentFood.name)) {
        favorites.push(currentFood);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Added to favorites ❤️");
    } else {
        alert("Already in favorites 😉");
    }
});

export { foodsData };