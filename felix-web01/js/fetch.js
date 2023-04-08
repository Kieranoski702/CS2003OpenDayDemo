"use strict"

// fetch the list of track objects from local storage or the host server

const trackurl = "data/TheBeatlesCleaned.json";
const APIURL = "https://www.googleapis.com/youtube/v3/search"

var APIKEY;

async function fetchTracks() {
    let raw = await fetch(trackurl);
    let tracks = await raw.json();

    for (let t of tracks) {
        if (!t.ytid) { // If not already cached, get it through the API
            t.ytid = fetchYTID(t);
        }
    }

    return tracks;
}

async function getTracks() {
    let localTracks = localStorage.getItem("libraryTracks");
    if (false) { // localStorage has the track list
        console.log("Track data found in local storage");
        console.log(localTracks);
        return JSON.parse(localTracks);
    } else { // we have to fetch them
        console.log("Fetching track data");
        let data = await fetchTracks();
        localStorage.setItem("libraryTracks", JSON.stringify(data)); // cache in local storage
        return data;
    }

}

async function fetchYTID(t) {
    // Fetch the first track ID from a keyword search
    let title = encodeURIComponent("The Beatles " + t.song);
    let search = APIURL+`?part=snippet&type=video&videoSyndicated=true&maxResults=1&q=${title}&type=video&key=${APIKEY}`;
    console.log(search);
    // let res = await fetch(search);
    // let videos = await res.json();
    // let id = videos.items[0].id.videoId;
    // console.log(`Fetched ID ${id} for ${t.song}`);
    // return id;
}
