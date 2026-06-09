(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    var menuButton = qs("[data-menu-toggle]");
    var mobilePanel = qs("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var hero = qs("[data-hero]");
    if (hero) {
        var slides = qsa("[data-hero-slide]", hero);
        var dots = qsa("[data-hero-dot]", hero);
        var current = 0;
        var timer;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startHero() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startHero();
            });
        });

        startHero();
    }

    qsa("[data-filter-input]").forEach(function (input) {
        var list = qs("[data-filter-list]");
        if (!list) {
            return;
        }
        var cards = qsa(".searchable-card", list);
        input.addEventListener("input", function () {
            var query = normalize(input.value);
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                card.hidden = query && text.indexOf(query) === -1;
            });
        });
    });

    function resultItem(movie) {
        return [
            '<a class="search-result-item" href="' + movie.url + '">',
            '<img src="' + movie.image + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy">',
            '<span><strong>' + movie.title + '</strong><span>' + movie.region + ' · ' + movie.year + ' · ' + movie.genre + '</span><p>' + movie.oneLine + '</p></span>',
            '</a>'
        ].join('');
    }

    function panelItem(movie) {
        return [
            '<a href="' + movie.url + '">',
            '<img src="' + movie.image + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy">',
            '<span><strong>' + movie.title + '</strong><span>' + movie.region + ' · ' + movie.year + '</span></span>',
            '</a>'
        ].join('');
    }

    function findMovies(query, limit) {
        var data = window.SEARCH_INDEX || [];
        var terms = normalize(query).split(/\s+/).filter(Boolean);
        if (!terms.length) {
            return [];
        }
        var matches = [];
        data.forEach(function (movie) {
            var text = normalize([movie.title, movie.region, movie.year, movie.genre, movie.tags, movie.oneLine].join(' '));
            var ok = terms.every(function (term) {
                return text.indexOf(term) !== -1;
            });
            if (ok) {
                matches.push(movie);
            }
        });
        return matches.slice(0, limit || 30);
    }

    qsa("[data-live-search]").forEach(function (input) {
        var form = input.closest("form");
        var panel = form ? qs("[data-live-search-panel]", form) : null;
        if (!panel) {
            return;
        }
        input.addEventListener("input", function () {
            var results = findMovies(input.value, 6);
            if (!results.length) {
                panel.classList.remove("is-open");
                panel.innerHTML = "";
                return;
            }
            panel.innerHTML = results.map(panelItem).join("");
            panel.classList.add("is-open");
        });
        document.addEventListener("click", function (event) {
            if (!form.contains(event.target)) {
                panel.classList.remove("is-open");
            }
        });
    });

    var searchResults = qs("#search-results");
    if (searchResults) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        var input = qs("[data-search-page-input]");
        if (input) {
            input.value = query;
        }
        var found = findMovies(query, 120);
        if (!query) {
            searchResults.innerHTML = '<div class="search-empty">输入关键词后即可浏览匹配影片。</div>';
        } else if (!found.length) {
            searchResults.innerHTML = '<div class="search-empty">没有找到相关影片。</div>';
        } else {
            searchResults.innerHTML = found.map(resultItem).join("");
        }
    }

    window.initMoviePlayer = function (source) {
        var player = qs("[data-player]");
        if (!player) {
            return;
        }
        var video = qs("video", player);
        var start = qs(".player-start", player);
        var attached = false;
        var hlsInstance = null;

        function attachSource() {
            if (attached) {
                return;
            }
            attached = true;
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();
            video.controls = true;
            if (start) {
                start.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    if (start) {
                        start.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (start) {
            start.addEventListener("click", playVideo);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener("play", function () {
            if (start) {
                start.classList.add("is-hidden");
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
