const apiKey = '0fb406d802222f0b4cab20429f89ec21';
const watchlist = [];

async function searchMovies() {
  const query = document.getElementById('search').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (data.results.length > 0) {
      data.results.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie';
        movieDiv.innerHTML = `
                            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} Poster">
                            <h3>${movie.title}</h3>
                            <p>Release Date: ${movie.release_date}</p>
                            <button onclick="addToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path}')">Add to Watchlist</button>
                        `;
        resultsDiv.appendChild(movieDiv);
      });
    } else {
      resultsDiv.innerHTML = '<p>No movies found.</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error fetching data. Please try again.');
  }
}

function addToWatchlist(movieId, title, posterPath) {
  if (!watchlist.find(movie => movie.id === movieId)) {
    watchlist.push({ id: movieId, title, posterPath });
    displayWatchlist();
  } else {
    alert('This movie is already in your watchlist.');
  }
}

function removeFromWatchlist(movieId) {
  const index = watchlist.findIndex(movie => movie.id === movieId);
  if (index > -1) {
    watchlist.splice(index, 1);
    displayWatchlist();
  }
}

function displayWatchlist() {
  const watchlistDiv = document.getElementById('watchlist');
  watchlistDiv.innerHTML = '';

  if (watchlist.length === 0) {
    watchlistDiv.innerHTML = '<p>Your watchlist is empty.</p>';
    return;
  }

  watchlist.forEach(movie => {
    const item = document.createElement('div');
    item.className = 'movie';
    item.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w200${movie.posterPath}" alt="${movie.title} Poster">
                    <h3>${movie.title}</h3>
                    <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
                `;
    watchlistDiv.appendChild(item);
  });
}

loadGenres();
updateWatchlist();