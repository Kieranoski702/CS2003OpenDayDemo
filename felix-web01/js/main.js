"use strict"

// main runtime after loading all the other js

let importBtn = document.getElementById("import");

getTracks().then(
    (tracks) => {
        populateLibrary(tracks);
        updatePlaylist();
        bindImportButton(tracks);
    }
)