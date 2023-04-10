"use strict"

// main runtime after loading all the other js

let importBtn = document.getElementById("import");

fetch("APIKEY").then(r => {
    r.text().then(t => {
        APIKEY = t;
    });
});

getTracks().then(
    (tracks) => {
        populateLibrary(tracks);
        updatePlaylist();
        bindImportButton(tracks);
    }
)

async function printYTID(tracks) {
    for (let t of tracks) {
        // console.log(t.song);
        console.log(await fetchYTID(t));
    }
}

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Use user selected theme if they previously chose one
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// Check if the user had a previously selected theme
if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // Save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});
