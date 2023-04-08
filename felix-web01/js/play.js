const playingName    = document.getElementById("player-bar-name");
const playingDetails = document.getElementById("player-bar-details");
const playingDur     = document.getElementById("player-bar-dur");
const playingPos     = document.getElementById("player-bar-timestamp");
const progress       = document.getElementById("progress");
const playBtn        = document.getElementById("play-btn");
const playBtnImg     = document.getElementById("play-btn-img");

function play(t) {
    console.log(`Playing ${t.ytid} (${t.song})`);
    audioPlayer.loadVideoById(t.ytid, 0);

    playingName.innerHTML = t.song;
    playingDetails.innerHTML = t.album + " • " + t.year;
    playingDur.innerHTML = formatMS(t.duration_ms);

    progress.style.width = 0.5*100 + "%";

    playingPos.innerHTML = formatMS(0.5*t.duration_ms);
}

function updatePlayerButton() {
    if (audioPlayer.getPlayerState() === YT.PlayerState.PLAYING
    || audioPlayer.getPlayerState() === YT.PlayerState.BUFFERING) {
        playBtnImg.setAttribute("src", "img/play.svg");
    } else {
        playBtnImg.setAttribute("src", "img/pause.svg");
    }
}

playBtn.onclick = () => {
    if (audioPlayer.getPlayerState() === YT.PlayerState.PLAYING
    || audioPlayer.getPlayerState() === YT.PlayerState.BUFFERING) {
        audioPlayer.pauseVideo();
    } else {
        audioPlayer.playVideo();
    }
    updatePlayerButton();
}
