
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mainNav = document.querySelector('[data-main-nav]');

    if (menuButton && mainNav) {
      menuButton.addEventListener('click', function () {
        mainNav.classList.toggle('is-open');
      });
    }

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
      var thumbs = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-target]'));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === current);
        });
        thumbs.forEach(function (thumb, i) {
          thumb.classList.toggle('is-active', i === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          show(Number(thumb.getAttribute('data-hero-target')) || 0);
          start();
        });
      });

      var prev = carousel.querySelector('[data-hero-prev]');
      var next = carousel.querySelector('[data-hero-next]');

      if (prev) {
        prev.addEventListener('click', function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(current + 1);
          start();
        });
      }

      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      show(0);
      start();
    }

    var filterInput = document.querySelector('[data-inline-filter]');
    var filterList = document.querySelector('[data-filter-list]');
    if (filterInput && filterList) {
      var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));
      filterInput.addEventListener('input', function () {
        var keyword = filterInput.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags')
          ].join(' ').toLowerCase();
          card.style.display = !keyword || text.indexOf(keyword) !== -1 ? '' : 'none';
        });
      });
    }
  });
})();
