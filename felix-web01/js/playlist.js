"use strict"

// playlist functionality like updating song count, exporting

var nTracks = 0;
var totalDur = 0;

// update playlist aggregate information
// song count, total duration
function updatePlaylist() {
    if (!nTracks) {
        plInfo.innerHTML = "This playlist is empty; add some songs from the Library!";
    } else {
        plInfo.innerHTML = nTracks + " songs - " + formatMS(totalDur);
    }
}
updatePlaylist();

function addTrack(t) {
    nTracks ++;
    totalDur += parseInt(t.duration_ms);
    updatePlaylist();
}

function removeTrack(t) {
    nTracks --;
    totalDur -= parseInt(t.duration_ms);
    updatePlaylist();
}

let exportBtn = document.getElementById("export");

// iterate through the playlist's track elements,
// copy a string of the IDs to the clipboard
exportBtn.onclick = () => {
    let ids = [];
    playlist.childNodes.forEach(t => {
        ids.push(t.dataset.trackid);
    });
    navigator.clipboard.writeText(ids.join(";")).then( () => {
        alert("Playlist contents copied to clipboard!")
    });
}

function bindImportButton(tracks) {
    importBtn.onclick = () => {
        let str = prompt("Please enter playlist content:");
        if (!str) return;

        // remove all tracks currently in the playlist
        while(playlist.lastChild) {
            playlist.removeChild(playlist.lastChild);
        }
        nTracks = 0;
        totalDur = 0;
        updatePlaylist();
        
        // re-populate with tracks
        str.split(";").forEach(id => {
            let t = tracks[id-1];
            let elmt = makePlaylistTrack(t);
            playlist.appendChild(elmt);
            addTrack(t);
        });
    }
}