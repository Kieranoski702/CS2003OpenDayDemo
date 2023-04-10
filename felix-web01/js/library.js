"use strict"

const library = document.getElementById('library');
const lbInfo = document.getElementById("lb-info");
const libraryOverlay = document.getElementById('library-overlay');
const playlistOverlay = document.getElementById('playlist-overlay');

var movingLibraryTrack = false;

libraryOverlay.ondrop = e => {
    e.preventDefault();
    removeTrack(currentDragged.track);
    currentDragged.remove();
    currentDragged = null;
    updateOverlays();
}

libraryOverlay.ondragover = e => {
    e.preventDefault();
    return false;
}

libraryOverlay.ondragenter = e => {
    e.preventDefault();
    currentDragged.classList.add("removing")
}

libraryOverlay.ondragleave = e => {
    e.preventDefault();
    currentDragged.classList.remove("removing")
}



playlistOverlay.ondragover = e => {
    e.preventDefault();
    return false;
}

playlistOverlay.ondrop = e => {
    e.preventDefault();
    if (movingLibraryTrack) {
        addTrack(currentDragged.track);
        playlist.appendChild(currentDragged);
    }
    currentDragged = null;
    updateOverlays();
}

// Make library tracks draggable into the library
function makeFetchable(el) {
    el.draggable = true;
    el.ondragstart = e => {
        currentDragged = makePlaylistTrack(el.track);
        movingLibraryTrack = true;
        updateOverlays();
    }
}

// this message will stay if there's an error populating the library
lbInfo.innerHTML = "Something went wrong and tracks could not be loaded."


// take an array of track objects and populate the library with elements
function populateLibrary(ts) {
    let nTracks = 0;
    let totalDur = 0;
    ts.forEach(t => {
        library.appendChild(
            makeLibraryTrack(t)
        );
        nTracks ++;
        totalDur += parseInt(t.duration_ms);
    });
    lbInfo.innerHTML = nTracks + " songs - " + formatMS(totalDur);
}

function updateOverlays() {
    if (currentDragged) {
        libraryOverlay.style.pointerEvents = "all";
        if (movingLibraryTrack) {
            playlistOverlay.style.pointerEvents = "all";
        }
    } else {
        libraryOverlay.style.pointerEvents = "none";
        playlistOverlay.style.pointerEvents = "none";
    }
}
updateOverlays();