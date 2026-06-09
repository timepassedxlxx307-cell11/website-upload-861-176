(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
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

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(parseInt(dot.getAttribute('data-hero-dot'), 10));
                start();
            });
        });

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

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function runFilter(scope, query) {
        var value = normalize(query);
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .wide-card'));

        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type')
            ].map(normalize).join(' ');

            card.setAttribute('data-hidden', value && haystack.indexOf(value) === -1 ? 'true' : 'false');
        });
    }

    document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var chips = scope.querySelector('[data-filter-chips]');

        if (input) {
            var params = new URLSearchParams(window.location.search);
            var initial = params.get('q');

            if (initial) {
                input.value = initial;
                runFilter(scope, initial);
            }

            input.addEventListener('input', function () {
                runFilter(scope, input.value);
            });
        }

        if (chips && input) {
            chips.querySelectorAll('[data-filter-value]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    chips.querySelectorAll('[data-filter-value]').forEach(function (item) {
                        item.classList.remove('active');
                    });
                    chip.classList.add('active');
                    input.value = chip.getAttribute('data-filter-value') || '';
                    runFilter(scope, input.value);
                });
            });
        }
    });
})();
