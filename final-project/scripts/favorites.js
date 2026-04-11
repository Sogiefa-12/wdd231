const container = document.getElementById("favorites-container");

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Load favorites
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites yet 😢</p>";
} else {
    favorites.forEach(food => {
        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}" loading="lazy">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
        `;

        container.appendChild(card);
    });
}

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