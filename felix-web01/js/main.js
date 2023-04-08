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
