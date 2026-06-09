(function () {
  function initMoviePlayer(videoId, coverId, sourceUrl) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var loaded = false;
    var hlsInstance = null;

    if (!video || !cover || !sourceUrl) {
      return;
    }

    function attachSource() {
      if (loaded) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }

      loaded = true;
    }

    function start() {
      attachSource();
      video.controls = true;
      cover.classList.add('is-hidden');
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          cover.classList.remove('is-hidden');
        });
      }
    }

    cover.addEventListener('click', start);
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
  }

  window.initMoviePlayer = initMoviePlayer;
})();
