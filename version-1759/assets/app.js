(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, itemIndex) {
      slide.classList.toggle('is-active', itemIndex === activeSlide);
    });
    dots.forEach(function (dot, itemIndex) {
      dot.classList.toggle('is-active', itemIndex === activeSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.site-search'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.filter-chip'));
  var currentFilter = 'all';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilter() {
    var query = normalize(searchInputs.map(function (input) {
      return input.value;
    }).filter(Boolean).join(' '));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var matchText = !query || haystack.indexOf(query) !== -1;
      var matchChip = currentFilter === 'all' || haystack.indexOf(normalize(currentFilter)) !== -1;
      card.classList.toggle('is-hidden', !(matchText && matchChip));
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var value = input.value;
      searchInputs.forEach(function (other) {
        if (other !== input) {
          other.value = value;
        }
      });
      applyFilter();
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      currentFilter = chip.getAttribute('data-filter') || 'all';
      chips.forEach(function (item) {
        item.classList.toggle('is-active', item === chip);
      });
      applyFilter();
    });
  });
})();
