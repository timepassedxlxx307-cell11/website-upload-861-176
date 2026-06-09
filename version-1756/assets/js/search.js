
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function card(item) {
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="video/' + item.id + '.html" aria-label="' + escapeHtml(item.title) + '">',
      '<img src="./' + item.poster + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="poster-badge">' + escapeHtml(item.year) + '</span>',
      '<span class="play-dot">▶</span>',
      '</a>',
      '<div class="card-body">',
      '<div class="card-meta"><a href="categories/' + item.categorySlug + '.html">' + escapeHtml(item.category) + '</a><span>' + escapeHtml(item.region) + '</span></div>',
      '<h3><a href="video/' + item.id + '.html">' + escapeHtml(item.title) + '</a></h3>',
      '<p>' + escapeHtml(item.oneLine) + '</p>',
      '<div class="tag-row"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.genre) + '</span></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  ready(function () {
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var form = document.querySelector('[data-search-form]');
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-chip]'));

    if (!input || !results || !Array.isArray(window.MOVIE_SEARCH_DATA)) {
      return;
    }

    function render(keyword) {
      var q = String(keyword || '').trim().toLowerCase();
      var matched = MOVIE_SEARCH_DATA.filter(function (item) {
        if (!q) {
          return true;
        }
        return item.search.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 80);

      if (!matched.length) {
        results.innerHTML = '<div class="search-empty">没有找到匹配内容，可以换一个关键词继续搜索。</div>';
        return;
      }

      results.innerHTML = matched.map(card).join('');
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;
    render(initial);

    input.addEventListener('input', function () {
      render(input.value);
    });

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        render(input.value);
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = chip.getAttribute('data-chip') || '';
        render(input.value);
      });
    });
  });
})();
