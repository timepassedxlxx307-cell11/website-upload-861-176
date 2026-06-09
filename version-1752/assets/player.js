(function() {
  window.initMoviePlayer = function(streamUrl) {
    var box = document.querySelector("[data-player]");
    if (!box) {
      return;
    }
    var video = box.querySelector("video");
    var cover = box.querySelector("[data-player-cover]");
    var error = box.querySelector("[data-player-error]");
    var hls = null;
    var attached = false;

    function setError(message) {
      if (error) {
        error.textContent = message || "";
      }
    }

    function attach() {
      if (attached || !video || !streamUrl) {
        return;
      }
      attached = true;
      setError("");
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function(event, data) {
          if (data && data.fatal) {
            setError("暂时无法播放，请稍后重试");
          }
        });
        return;
      }
      setError("当前环境暂时无法播放，请稍后重试");
    }

    function play() {
      attach();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function() {
          if (cover) {
            cover.classList.remove("is-hidden");
          }
        });
      }
    }

    if (cover) {
      cover.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function() {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
    }
    window.addEventListener("pagehide", function() {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
