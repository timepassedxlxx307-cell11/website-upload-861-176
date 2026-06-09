(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === current);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                show(current + 1);
            }, 5200);
        }
    }

    var searchInput = document.querySelector('[data-search-input]');
    var categorySelect = document.querySelector('[data-filter-category]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function applyFilters() {
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var category = categorySelect ? categorySelect.value : '';
        var yearLimit = yearSelect ? parseInt(yearSelect.value || '0', 10) : 0;

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var cardCategory = card.getAttribute('data-category') || '';
            var cardYear = parseInt(card.getAttribute('data-year') || '0', 10);
            var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchedCategory = !category || cardCategory === category;
            var matchedYear = !yearLimit || cardYear >= yearLimit;

            card.classList.toggle('is-filtered-out', !(matchedKeyword && matchedCategory && matchedYear));
        });
    }

    if (cards.length) {
        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        if (categorySelect) {
            categorySelect.addEventListener('change', applyFilters);
        }
        if (yearSelect) {
            yearSelect.addEventListener('change', applyFilters);
        }
    }
})();
