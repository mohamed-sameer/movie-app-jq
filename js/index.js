/// <reference types="../@types/jquery/" />;
$(function () {
  let allMovies = [];
  let currentMovieType = "nowPlaying";

  // general settings
  $("#NowPlaying .movie-layer h2").slideUp(0);
  $("#NowPlaying .movie-layer .movie-desc").fadeOut(0);
  $("#NowPlaying .movie-layer .movie-desc").animate({ width: "hide" }, 1000);
  $("#NowPlaying .movie-layer .rating-details").fadeOut(0);

  $(".drawer .menu-bars").on("click", function () {
    $(".side-menu").toggleClass("show-menu");
    $(this).children(".fa-bars").toggleClass("d-none");
    $(this).children(".fa-xmark").toggleClass("d-none");
  });

  //  style hover movie
  $(document).on("mouseenter", "#NowPlaying .movie-card", function () {
    $(this)
      .find(".movie-layer h2")
      .slideDown(500, function () {
        $(this).closest(".movie-card").find(".movie-desc").fadeIn(500);
        $(this).closest(".movie-card").find(".rating-details").fadeIn(500);
      });
  });

  $(document).on("mouseleave", "#NowPlaying .movie-card", function () {
    $(this)
      .find(".movie-layer h2")
      .slideUp(500, function () {
        $(this).closest(".movie-card").find(".movie-desc").fadeOut(500);
        $(this).closest(".movie-card").find(".rating-details").fadeOut(500);
      });
  });

  async function getNowPlaying() {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=a295c2fda0d44898d34830970fce7edc&language=en-US&include_adult=false"
    );
    const data = await response.json();
    return data.results;
  }

  async function getPopular() {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=a295c2fda0d44898d34830970fce7edc&language=en-US&include_adult=false"
    );
    const data = await response.json();
    return data.results;
  }

  async function getTopRated() {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated?api_key=a295c2fda0d44898d34830970fce7edc&language=en-US&include_adult=false"
    );
    const data = await response.json();
    return data.results;
  }

  async function getTrending() {
    const response = await fetch(
      "https://api.themoviedb.org/3/trending/movie/day?api_key=a295c2fda0d44898d34830970fce7edc&language=en-US&include_adult=false"
    );
    const data = await response.json();
    return data.results;
  }

  async function getUpcoming() {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/upcoming?api_key=a295c2fda0d44898d34830970fce7edc&language=en-US&include_adult=false"
    );
    const data = await response.json();
    return data.results;
  }

  function displayStars(rating) {
    const maxStars = 5;
    let starsHtml = "";

    const normalizedRating = (rating / 2).toFixed(1);

    for (let i = 1; i <= maxStars; i++) {
      if (i <= Math.floor(normalizedRating)) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else if (
        i === Math.ceil(normalizedRating) &&
        !Number.isInteger(normalizedRating)
      ) {
        const partialFill = (normalizedRating % 1) * 100;
        starsHtml += `<i class="fas fa-star-half-alt" style="background: linear-gradient(to right, #ffc107 ${partialFill}%, #ddd ${partialFill}%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>`;
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }

    return starsHtml;
  }

  function displayMovies(movies) {
    const baseURL = "https://image.tmdb.org/t/p/w500";
    let html = "";
    for (const movie of movies) {
      html += `
        <div class="col-md-4">
          <div class="movie-card rounded-2 overflow-hidden" data-movie-id=${
            movie.id
          }>
            <div class="movie-poster">
              <img class="w-100" src="${baseURL}${movie.poster_path}" alt="${
        movie.title
      }" />
            </div>
            <div class="movie-layer p-3">
              <h2 class="h3 pb-2">${movie.title}</h2>
              <p class="movie-desc">
                ${movie.overview}
              </p>
              <div class="rating-details">
                <p class="release-date">Release Date: ${movie.release_date}</p>
                <div class="star-rating movie-rating">
                  ${displayStars(movie.vote_average)}
                </div>
                <div class="rating-number">
                <span>
                ${movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    $("#NowPlaying .row").html(html);
  }

  async function fetchAndDisplayMovies(movieType) {
    currentMovieType = movieType;
    let movies;
    switch (movieType) {
      case "nowPlaying":
        movies = await getNowPlaying();
        break;
      case "popular":
        movies = await getPopular();
        break;
      case "topRated":
        movies = await getTopRated();
        break;
      case "trending":
        movies = await getTrending();
        break;
      case "upcoming":
        movies = await getUpcoming();
        break;
      default:
        movies = await getNowPlaying();
    }
    allMovies = movies;
    displayMovies(movies);
  }

  function searchMovies() {
    const query = $("#search").val().toLowerCase();
    if (query) {
      const filteredMovies = allMovies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.overview.toLowerCase().includes(query)
      );
      displayMovies(filteredMovies);
    } else {
      displayMovies(allMovies);
    }
  }

  $(".search-bar input").on("input", searchMovies);

  $(".side-nav li").on("click", function () {
    const target = $(this).data("target");
    fetchAndDisplayMovies(target);
  });

  fetchAndDisplayMovies("nowPlaying");
});
