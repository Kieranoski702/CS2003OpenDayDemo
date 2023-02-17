let player = document.getElementById("player");
let playerName = document.getElementById("player-name");
let playerDetails = document.getElementById("player-details");
let playerDur = document.getElementById("player-dur");
let playerPos = document.getElementById("player-pos");
let progress = document.getElementById("progress");

function play(t) {
    playerName.innerHTML = t.song;
    playerDetails.innerHTML = t.album + " • " + t.year;
    playerDur.innerHTML = formatMS(t.duration_ms);

    player.style.gap = "6px";

    let r = Math.random();
    progress.style.width = r*100 + "%";
    playerPos.innerHTML = formatMS(r*t.duration_ms);
}