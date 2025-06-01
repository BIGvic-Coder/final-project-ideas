const tmdbApiKey = "d734ead6b5b2fb87c2c6e2bb1e84a593"; // Your TMDB key
const omdbApiKey = "1e6d55e3"; // ✅ Just the OMDb API key

const app = document.querySelector("#app");

app.innerHTML = `
  <h1>🎬 Movie Explorer</h1>
  <input type="text" id="searchInput" placeholder="Enter movie title..." />
  <button id="searchBtn">Search</button>
  <div id="results"></div>
`;

document.querySelector("#searchBtn").addEventListener("click", async () => {
  const query = document.querySelector("#searchInput").value.trim();
  if (!query) {
    alert("Please enter a movie title.");
    return;
  }
  document.querySelector("#results").innerHTML = "Loading...";

  try {
    // Search movie using TMDB
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(
        query
      )}`
    );
    const tmdbData = await tmdbRes.json();

    if (!tmdbData.results.length) {
      document.querySelector("#results").innerHTML = "No movies found.";
      return;
    }

    const movie = tmdbData.results[0];
    const title = movie.title;
    const year = movie.release_date ? movie.release_date.split("-")[0] : "";

    // Get details from OMDb
    const omdbRes = await fetch(
      `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${encodeURIComponent(
        title
      )}&y=${year}`
    );
    const omdbData = await omdbRes.json();

    if (omdbData.Response === "False") {
      document.querySelector("#results").innerHTML = "Details not found.";
      return;
    }

    document.querySelector("#results").innerHTML = `
      <h2>${omdbData.Title} (${omdbData.Year})</h2>
      <img src="${
        movie.poster_path
          ? "https://image.tmdb.org/t/p/w300" + movie.poster_path
          : "https://via.placeholder.com/300x450?text=No+Image"
      }" alt="Poster" style="max-width: 200px;" />
      <p><strong>Genre:</strong> ${omdbData.Genre}</p>
      <p><strong>Plot:</strong> ${omdbData.Plot}</p>
      <p><strong>IMDB Rating:</strong> ${omdbData.imdbRating}</p>
      <p><strong>Actors:</strong> ${omdbData.Actors}</p>
    `;
  } catch (error) {
    document.querySelector("#results").innerHTML = "Error fetching data.";
    console.error(error);
  }
});
