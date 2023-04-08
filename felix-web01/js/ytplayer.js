var audioPlayer;

function onYouTubeIframeAPIReady() {
    audioPlayer = new YT.Player("youtube-player", {
        height:"0",
        width:"0",
        videoId: "",
        playerVars: {
            autoplay: false,
            loop: false
        },
        events: {
            'onReady': e => {
                e.target.playVideo()
            },
            'onStateChange': (e) => {}
        }
    });
}
