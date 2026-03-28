// SET TIMESTAMP
document.querySelector("#timestamp").value = Date.now();

// OPEN MODALS
document.querySelectorAll("[data-modal]").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const modal = document.getElementById(link.dataset.modal);
        modal.showModal();
    });
});

// CLOSE BUTTON
document.querySelectorAll(".close").forEach(button => {
    button.addEventListener("click", () => {
        button.closest("dialog").close();
    });
});

// CLICK OUTSIDE TO CLOSE
document.querySelectorAll("dialog").forEach(dialog => {
    dialog.addEventListener("click", (event) => {
        const rect = dialog.getBoundingClientRect();
        const clickedOutside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

        if (clickedOutside) {
            dialog.close();
        }
    });
});

// ESC KEY CLOSE (improves accessibility)
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document.querySelectorAll("dialog[open]").forEach(dialog => {
            dialog.close();
        });
    }
});


/* FOOTER */

const year = document.querySelector("#year");
const lastModified = document.querySelector("#lastModified");

if (year) year.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = document.lastModified;
