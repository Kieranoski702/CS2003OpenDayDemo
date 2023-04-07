let playerBar = document.getElementById("player-bar");
let playingName = document.getElementById("player-bar-name");
let playingDetails = document.getElementById("player-bar-details");
let playingDur = document.getElementById("player-bar-dur");
let playingPos = document.getElementById("player-bar-pos");
let progress = document.getElementById("progress");

function play(t) {
    playingName.innerHTML = t.song;
    playingDetails.innerHTML = t.album + " • " + t.year;
    playingDur.innerHTML = formatMS(t.duration_ms);

    playerBar.style.gap = "6px";

    playingPos.innerHTML = formatMS(0*t.duration_ms);
}