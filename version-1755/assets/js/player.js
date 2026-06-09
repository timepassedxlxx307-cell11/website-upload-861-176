(function () {
  var video = document.querySelector('[data-video]');
  var button = document.querySelector('[data-play]');
  var hls = null;

  if (!video || !button) {
    return;
  }

  var stream = button.getAttribute('data-stream');

  var play = function () {
    if (!stream) {
      return;
    }

    button.classList.add('is-hidden');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== stream) {
        video.src = stream;
      }
      video.play().catch(function () {
        button.classList.remove('is-hidden');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!hls) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      }
      var begin = function () {
        video.play().catch(function () {
          button.classList.remove('is-hidden');
        });
      };
      if (video.readyState > 0) {
        begin();
      } else {
        video.addEventListener('loadedmetadata', begin, { once: true });
      }
      return;
    }

    video.src = stream;
    video.play().catch(function () {
      button.classList.remove('is-hidden');
    });
  };

  button.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
})();
