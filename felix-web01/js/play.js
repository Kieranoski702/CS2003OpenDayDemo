const playingName    = document.getElementById("player-bar-name");
const playingDetails = document.getElementById("player-bar-details");
const playingDur     = document.getElementById("player-bar-dur");
const playingPos     = document.getElementById("player-bar-timestamp");
const progress       = document.getElementById("progress");
const playBtn        = document.getElementById("play-btn");
const playBtnImg     = document.getElementById("play-btn-img");

function play(t) {
    console.log(`Playing ${t.ytid} (${t.song})`);
    player.loadVideoById(t.ytid, 0);

    playingName.innerText = t.song;
    playingDetails.innerText = t.album + " • " + t.year;
    playingDur.innerText = formatMS(t.duration_ms);
    playingPos.innerText = "0:00";
    progress.style.width = "0%";
}

// function updatePlayerButton() {
//     if (player.getPlayerState() === YT.PlayerState.PLAYING
//     || player.getPlayerState() === YT.PlayerState.BUFFERING) {
//         playBtnImg.setAttribute("src", "img/play.svg");
//     } else {
//         playBtnImg.setAttribute("src", "img/pause.svg");
//     }
// }

function updatePlayerButton() {
    var playBtn = document.getElementById("play-btn-img");
    var pauseBtn = document.getElementById("pause-btn-img");
    if (player.getPlayerState() === YT.PlayerState.PLAYING
        || player.getPlayerState() === YT.PlayerState.BUFFERING) {
        playBtn.style.display = "block";
        pauseBtn.style.display = "none";
    } else {
        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
    }
}

function updateProgress() {
    let cur = player.getCurrentTime();
    let prog = (player.getCurrentTime()/player.getDuration())*100;
    playingPos.innerText = formatSec(cur);
    progress.style.width = prog + "0%";
}
setInterval(updateProgress, 1000); // update progress bar every second

playBtn.onclick = () => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING
    || player.getPlayerState() === YT.PlayerState.BUFFERING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
    updatePlayerButton();
}
