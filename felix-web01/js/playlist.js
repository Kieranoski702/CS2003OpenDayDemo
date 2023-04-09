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
// save the string to a file called platlistX.beat in the downloads folder
// Where X goes from 1 upwards depending on how many saved playlists there are already
exportBtn.onclick = () => {
    let ids = [];
    playlist.childNodes.forEach(t => {
        ids.push(t.dataset.trackid);
    });
    let str = ids.join(";");
    let playlistFiles = localStorage.getItem("playlistFiles");
    let playlistCount = playlistFiles ? playlistFiles.split(",").length : 0;
    let a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
    a.download = "playlist" + (playlistCount + 1) + ".beat";
    a.click();
    localStorage.setItem("playlistFiles", a.download + (playlistFiles ? "," + playlistFiles : ""));
}

// Open import popup to import the playlist from a .beat file, set str to the contents of the file
function bindImportButton(tracks) {
    importBtn.onclick = () => {
        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".beat";
        fileInput.onchange = () => {
            let file = fileInput.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                let str = reader.result;
                importPlaylist(tracks, str);
            }
            reader.readAsText(file);
        }
        fileInput.click();
    }
}

// import a playlist from a .beat file
function importPlaylist(tracks, str) {
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