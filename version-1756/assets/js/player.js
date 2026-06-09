
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));

    players.forEach(function (box) {
      var video = box.querySelector('video');
      var overlay = box.querySelector('.player-overlay');
      var src = box.getAttribute('data-src');
      var started = false;
      var hls = null;

      function showMessage(text) {
        var old = box.querySelector('.player-message');
        if (old) {
          old.remove();
        }
        var node = document.createElement('div');
        node.className = 'player-message';
        node.textContent = text;
        box.appendChild(node);
      }

      function start() {
        if (!video || !src) {
          showMessage('视频加载失败，请刷新页面重试');
          return;
        }

        if (overlay) {
          overlay.classList.add('is-hidden');
        }

        if (!started) {
          started = true;
          video.controls = true;

          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.play().catch(function () {
              showMessage('点击视频区域继续播放');
            });
            return;
          }

          if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {
                showMessage('点击视频区域继续播放');
              });
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
              if (data && data.fatal) {
                showMessage('视频加载失败，请刷新页面重试');
              }
            });
          } else {
            showMessage('当前浏览器暂时无法播放该视频');
          }
        } else {
          video.play().catch(function () {
            showMessage('点击视频区域继续播放');
          });
        }
      }

      if (overlay) {
        overlay.addEventListener('click', start);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (!started || video.paused) {
            start();
          } else {
            video.pause();
          }
        });
      }

      window.addEventListener('pagehide', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
