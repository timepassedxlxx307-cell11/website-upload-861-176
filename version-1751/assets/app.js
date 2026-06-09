(function() {
  var menuButton = document.querySelector('[data-mobile-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    var activate = function(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    };

    dots.forEach(function(dot, dotIndex) {
      dot.addEventListener('click', function() {
        activate(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function() {
        activate(activeIndex + 1);
      }, 5200);
    }
  }

  var filterInput = document.querySelector('[data-live-filter]');
  var filterScope = document.querySelector('[data-filter-scope]');
  var emptyState = document.querySelector('[data-empty-state]');

  var applyFilter = function(value) {
    if (!filterScope) {
      return;
    }
    var query = (value || '').trim().toLowerCase();
    var visible = 0;
    filterScope.querySelectorAll('[data-search]').forEach(function(card) {
      var content = (card.getAttribute('data-search') || '').toLowerCase();
      var matched = !query || content.indexOf(query) !== -1;
      card.classList.toggle('is-hidden-by-filter', !matched);
      if (matched) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle('visible', visible === 0);
    }
  };

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (query) {
      filterInput.value = query;
    }
    applyFilter(filterInput.value);
    filterInput.addEventListener('input', function() {
      applyFilter(filterInput.value);
    });
  }
})();

function initializePlayer(streamUrl) {
  var video = document.querySelector('.cinema-video');
  var cover = document.querySelector('.cinema-player-cover');
  var hlsInstance = null;

  if (!video || !cover || !streamUrl) {
    return;
  }

  var attachSource = function() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', streamUrl);
      }
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      }
      return;
    }

    if (!video.getAttribute('src')) {
      video.setAttribute('src', streamUrl);
    }
  };

  var start = function() {
    attachSource();
    cover.classList.add('is-hidden');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function() {
        cover.classList.remove('is-hidden');
      });
    }
  };

  cover.addEventListener('click', start);
  video.addEventListener('click', function() {
    if (video.paused) {
      start();
    }
  });
}
