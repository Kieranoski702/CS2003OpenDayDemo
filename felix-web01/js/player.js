var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height:"300",
        width:"300",
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