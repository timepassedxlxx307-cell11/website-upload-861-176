(function () {
    function prepare(root) {
        var video = root.querySelector('[data-player-video]');
        var button = root.querySelector('[data-player-button]');
        var stream = video ? video.getAttribute('data-stream') : '';
        var loaded = false;
        var instance = null;

        if (!video || !button || !stream) {
            return;
        }

        function bind() {
            if (loaded) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                instance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                instance.loadSource(stream);
                instance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else {
                video.src = stream;
            }

            loaded = true;
        }

        function start(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            bind();
            button.classList.add('is-hidden');
            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {
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

        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                button.classList.remove('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(prepare);
})();
