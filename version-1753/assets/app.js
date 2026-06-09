import { H as Hls } from "./hls-vendor-dru42stk.js";

function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initMobileMenu() {
  const button = document.querySelector("[data-mobile-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!button || !menu) {
    return;
  }
  button.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });
}

function initHeroCarousel() {
  const root = document.querySelector("[data-hero-carousel]");
  if (!root) {
    return;
  }
  const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(root.querySelectorAll("[data-hero-dot]"));
  if (slides.length < 2) {
    return;
  }
  let current = 0;
  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  };
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => show(index));
  });
  window.setInterval(() => show(current + 1), 5000);
}

function initCategoryFilters() {
  document.querySelectorAll("[data-filter-panel]").forEach((panel) => {
    const list = document.querySelector("[data-filter-list]");
    if (!list) {
      return;
    }
    const cards = Array.from(list.querySelectorAll(".movie-card"));
    const textInput = panel.querySelector("[data-filter-text]");
    const yearSelect = panel.querySelector("[data-filter-year]");
    const regionSelect = panel.querySelector("[data-filter-region]");
    const apply = () => {
      const query = normalize(textInput ? textInput.value : "");
      const year = normalize(yearSelect ? yearSelect.value : "");
      const region = normalize(regionSelect ? regionSelect.value : "");
      cards.forEach((card) => {
        const content = normalize([
          card.dataset.title,
          card.dataset.genre,
          card.dataset.type,
          card.dataset.tags,
          card.dataset.region,
          card.dataset.year
        ].join(" "));
        const matchesQuery = !query || content.includes(query);
        const matchesYear = !year || normalize(card.dataset.year) === year;
        const matchesRegion = !region || normalize(card.dataset.region) === region;
        card.classList.toggle("is-hidden", !(matchesQuery && matchesYear && matchesRegion));
      });
    };
    [textInput, yearSelect, regionSelect].forEach((control) => {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
  });
}

function movieCardTemplate(movie) {
  return `
<article class="movie-card">
  <a href="${escapeHtml(movie.url)}" class="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
    <span class="relative overflow-hidden block">
      <img src="./${escapeHtml(movie.cover)}" alt="${escapeHtml(movie.title)}" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
      <span class="absolute top-4 left-4">
        <span class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">${escapeHtml(movie.category)}</span>
      </span>
      <span class="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">${escapeHtml(movie.year)}年</span>
    </span>
    <span class="block p-5">
      <span class="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition">${escapeHtml(movie.title)}</span>
      <span class="mt-2 text-sm text-gray-600 line-clamp-2 block">${escapeHtml(movie.oneLine)}</span>
      <span class="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>${escapeHtml(movie.region)}</span>
        <span>${escapeHtml(movie.genre)}</span>
      </span>
    </span>
  </a>
</article>`;
}

function initSearchPage() {
  const results = document.querySelector("[data-search-results]");
  const input = document.querySelector("[data-search-page-input]");
  if (!results || !Array.isArray(window.SEARCH_MOVIES)) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  if (input) {
    input.value = query;
  }
  const normalizedQuery = normalize(query);
  const movies = window.SEARCH_MOVIES;
  const matches = normalizedQuery
    ? movies.filter((movie) => normalize([
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.tags,
        movie.oneLine
      ].join(" ")).includes(normalizedQuery)).slice(0, 120)
    : movies.slice(0, 120);
  if (!matches.length) {
    results.innerHTML = `<div class="search-empty">没有找到匹配的影片，请更换关键词。</div>`;
    return;
  }
  results.innerHTML = matches.map(movieCardTemplate).join("");
}

export function initMoviePlayer(source) {
  const video = document.querySelector(".movie-player");
  const cover = document.querySelector(".player-cover");
  if (!video || !source) {
    return;
  }
  let hlsInstance = null;
  let started = false;
  const hideCover = () => {
    if (cover) {
      cover.classList.add("is-hidden");
    }
  };
  const start = () => {
    hideCover();
    if (started) {
      video.play().catch(() => {});
      return;
    }
    started = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.play().catch(() => {});
      return;
    }
    if (Hls.isSupported()) {
      hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        if (data && data.fatal && hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
          video.src = source;
          video.play().catch(() => {});
        }
      });
      return;
    }
    video.src = source;
    video.play().catch(() => {});
  };
  if (cover) {
    cover.addEventListener("click", start);
  }
  video.addEventListener("click", () => {
    if (video.paused) {
      start();
    }
  });
}

ready(() => {
  initMobileMenu();
  initHeroCarousel();
  initCategoryFilters();
  initSearchPage();
});
