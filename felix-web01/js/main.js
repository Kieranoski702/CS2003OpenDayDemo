"use strict"

// main runtime after loading all the other js

let importBtn = document.getElementById("import");

fetch("APIKEY").then(r => {
    r.text().then(t => {
        console.log(t);
    });
});

getTracks().then(
    (tracks) => {
        populateLibrary(tracks);
        updatePlaylist();
        bindImportButton(tracks);
    }
)