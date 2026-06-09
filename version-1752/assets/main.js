(function() {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function() {
      panel.classList.toggle("is-open");
      button.textContent = panel.classList.contains("is-open") ? "×" : "☰";
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function play() {
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener("click", function() {
        show(i);
        if (timer) {
          window.clearInterval(timer);
          play();
        }
      });
    });

    show(0);
    play();
  }

  function initFilters() {
    var areas = Array.prototype.slice.call(document.querySelectorAll("[data-filter-area]"));
    areas.forEach(function(area) {
      var input = area.querySelector("[data-filter-input]");
      var year = area.querySelector("[data-filter-year]");
      var type = area.querySelector("[data-filter-type]");
      var empty = area.querySelector("[data-empty]");
      var cards = Array.prototype.slice.call(area.querySelectorAll("[data-card]"));

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var selectedYear = year ? year.value : "";
        var selectedType = type ? type.value : "";
        var shown = 0;
        cards.forEach(function(card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var matched = true;
          if (q && text.indexOf(q) === -1) {
            matched = false;
          }
          if (selectedYear && cardYear !== selectedYear) {
            matched = false;
          }
          if (selectedType && cardType !== selectedType) {
            matched = false;
          }
          card.hidden = !matched;
          if (matched) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
      }

      [input, year, type].forEach(function(item) {
        if (item) {
          item.addEventListener("input", apply);
          item.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function(tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return [
      "<article class=\"movie-card\">",
      "<a class=\"movie-poster\" href=\"" + escapeAttr(movie.url) + "\">",
      "<img src=\"" + escapeAttr(movie.cover) + "\" alt=\"" + escapeAttr(movie.title) + "\" loading=\"lazy\">",
      "</a>",
      "<div class=\"movie-info\">",
      "<div class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
      "<h3><a href=\"" + escapeAttr(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
      "<p>" + escapeHtml(movie.oneLine) + "</p>",
      "<div class=\"tag-row\">" + tags + "</div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>]/g, function(ch) {
      return {"&": "&amp;", "<": "&lt;", ">": "&gt;"}[ch];
    });
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  function initSearchPage() {
    var form = document.querySelector("[data-search-page-form]");
    var input = document.querySelector("[data-search-page-input]");
    var results = document.querySelector("[data-search-results]");
    var title = document.querySelector("[data-search-title]");
    if (!form || !input || !results || !window.MOVIE_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;

    function run(query) {
      var q = query.trim().toLowerCase();
      if (title) {
        title.textContent = q ? "搜索：" + query.trim() : "搜索影片";
      }
      if (!q) {
        results.innerHTML = window.MOVIE_INDEX.slice(0, 24).map(movieCard).join("");
        return;
      }
      var words = q.split(/\s+/).filter(Boolean);
      var matched = window.MOVIE_INDEX.filter(function(movie) {
        var text = movie.searchText.toLowerCase();
        return words.every(function(word) {
          return text.indexOf(word) !== -1;
        });
      }).slice(0, 120);
      results.innerHTML = matched.length ? matched.map(movieCard).join("") : "<div class=\"empty-state\">没有找到匹配的影片</div>";
    }

    form.addEventListener("submit", function(event) {
      event.preventDefault();
      var value = input.value.trim();
      var url = value ? "./search.html?q=" + encodeURIComponent(value) : "./search.html";
      history.replaceState(null, "", url);
      run(value);
    });

    run(initial);
  }

  ready(function() {
    initMenu();
    initHero();
    initFilters();
    initSearchPage();
  });
})();
