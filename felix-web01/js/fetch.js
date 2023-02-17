"use strict"

// fetch the list of track objects from local storage or the host server

const trackurl = "data/TheBeatlesCleaned.json";

async function fetchTracks() {
    let raw = await fetch(trackurl);
    return raw.json();
}

async function getTracks() {
    if (localStorage.getItem("libraryTracks")) { // localStorage has the track list
        console.log("Track data found in local storage");
        return JSON.parse(
            localStorage.getItem("libraryTracks")
        );
    } else { // we have to fetch them
        console.log("Fetching track data");
        let data = await fetchTracks();
        localStorage.setItem("libraryTracks", JSON.stringify(data)); // cache in local storage
        return data;
    }
}
