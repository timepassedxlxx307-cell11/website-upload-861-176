(function () {
  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setMobileMenu() {
    var button = document.querySelector("[data-menu-button]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function setSearch() {
    var inputs = document.querySelectorAll("[data-search-input]");
    inputs.forEach(function (input) {
      var targetSelector = input.getAttribute("data-target") || "#movie-grid";
      var target = document.querySelector(targetSelector);
      if (!target) {
        return;
      }
      var cards = Array.prototype.slice.call(target.querySelectorAll("[data-movie-card]"));
      var empty = document.querySelector(input.getAttribute("data-empty") || "#empty-state");
      input.addEventListener("input", function () {
        var keyword = normalize(input.value);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-genre") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-year") + " " + card.getAttribute("data-region"));
          var matched = !keyword || haystack.indexOf(keyword) !== -1;
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      });
    });
  }

  function setHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
      });
    }
    window.setInterval(function () {
      show(index + 1);
    }, 5600);
    show(0);
  }

  function setPlayers() {
    var players = document.querySelectorAll("[data-player]");
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var layer = player.querySelector("[data-play-layer]");
      var button = player.querySelector("[data-play-button]");
      if (!video) {
        return;
      }
      function attach() {
        var url = video.getAttribute("data-stream");
        if (!url) {
          return;
        }
        if (video.getAttribute("data-ready") !== "1") {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            video.hlsInstance = hls;
          } else {
            video.src = url;
          }
          video.setAttribute("data-ready", "1");
        }
        video.controls = true;
        if (layer) {
          layer.classList.add("is-hidden");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }
      if (layer) {
        layer.addEventListener("click", attach);
      }
      if (button) {
        button.addEventListener("click", function (event) {
          event.stopPropagation();
          attach();
        });
      }
      video.addEventListener("click", function () {
        if (video.getAttribute("data-ready") !== "1") {
          attach();
        }
      });
    });
  }

  setMobileMenu();
  setSearch();
  setHero();
  setPlayers();
})();
