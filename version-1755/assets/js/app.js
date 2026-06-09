(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    var setSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('active', position === current);
      });
    };

    var start = function () {
      timer = window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    };

    var reset = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setSlide(index);
        reset();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        setSlide(current - 1);
        reset();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setSlide(current + 1);
        reset();
      });
    }

    start();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
  var lists = Array.prototype.slice.call(document.querySelectorAll('[data-filter-list]'));
  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';

  var normalize = function (value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  };

  var applyFilter = function (value) {
    var keyword = normalize(value);
    lists.forEach(function (list) {
      var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.textContent
        ].join(' ');
        var matched = !keyword || normalize(text).indexOf(keyword) !== -1;
        card.classList.toggle('is-filtered', !matched);
      });
    });
  };

  forms.forEach(function (form) {
    var input = form.querySelector('[data-search-input]');
    if (!input) {
      return;
    }
    if (query) {
      input.value = query;
      applyFilter(query);
    }
    input.addEventListener('input', function () {
      applyFilter(input.value);
    });
    form.addEventListener('submit', function (event) {
      if (lists.length) {
        event.preventDefault();
        applyFilter(input.value);
      }
    });
  });

  if (query && lists.length) {
    applyFilter(query);
  }
})();
