// common.js

/* =========================
   FOOTER: YEAR & LAST MODIFIED
========================= */
export function updateFooter() {
    const year = document.getElementById("year");
    const lastModified = document.getElementById("lastModified");

    if (year) year.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = document.lastModified;
}

/* =========================
   HAMBURGER MENU
========================= */
export function initHamburgerMenu() {
    const menuButton = document.getElementById("menu");
    const nav = document.querySelector(".navigation");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuButton.classList.toggle("open");
        });
    }
}