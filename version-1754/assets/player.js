(function () {
    var video = document.querySelector('[data-video]');
    var button = document.querySelector('[data-play-button]');

    if (!video || !button) {
        return;
    }

    var stream = button.getAttribute('data-stream');
    var ready = false;
    var hlsInstance = null;

    function attachStream() {
        if (ready || !stream) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            ready = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls();
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
            ready = true;
            return;
        }

        video.src = stream;
        ready = true;
    }

    function start() {
        attachStream();
        button.classList.add('is-hidden');
        var playback = video.play();

        if (playback && typeof playback.catch === 'function') {
            playback.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    }

    button.addEventListener('click', start);

    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
            hlsInstance.destroy();
        }
    });
})();
