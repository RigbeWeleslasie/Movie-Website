const apiKey = '0fb406d802222f0b4cab20429f89ec21';
const watchlist = [];

// Search for movies
async function searchMovies() {
    const query = document.getElementById('search').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!query) {
        resultsDiv.innerHTML = '<p>Please enter a movie name.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          data.results.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';
        
            // Fallback for poster
            const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : 'https://via.placeholder.com/200x300?text=No+Image';
        
            const overviewId = `overview-${movie.id}`;
        
            movieDiv.innerHTML = `
                <img src="${posterUrl}" alt="${movie.title} Poster" style="cursor:pointer;" onclick="document.getElementById('${overviewId}').style.display = document.getElementById('${overviewId}').style.display === 'block' ? 'none' : 'block'">
                <h3>${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : 'Not available'})</h3>
                <p>Release Date: <b>${movie.release_date || 'Not available'}</b></p>
                <p>TMDB Rating: <b>${movie.vote_average ? movie.vote_average.toFixed(1) : 'Not Available'}</b>⭐</p>
                <div id="${overviewId}" style="display:none; margin:10px 0; padding:10px; background:#f8f8f8; border-radius:5px; color:black;">
                    <b>Overview:</b> ${movie.overview ? movie.overview : 'No overview available.'}
                </div>
                <div class="rating-group">
                    <label for="rating-${movie.id}">Your Rating: </label>
                    <input type="number" id="rating-${movie.id}" min="1" max="10" step="0.1" placeholder="7.5">
                </div>
                <button onclick="addToWatchlist(${movie.id}, '${escapeQuotes(movie.title)}', '${movie.poster_path ? movie.poster_path : ''}', '${movie.release_date || ''}')">Add to Watchlist</button>
            `;
            resultsDiv.appendChild(movieDiv);
        });
        } else {
            resultsDiv.innerHTML = '<p>No movies found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = '<p style="color:red;">Error fetching data. Please try again.</p>';
    }
}

// Add movie to watchlist
function addToWatchlist(movieId, title, posterPath,release_date) {
    if (watchlist.find(movie => movie.id === movieId)) {
        alert('This movie is already in your watchlist.');
        return;
    }
    // Get user rating
    const ratingInput = document.getElementById(`rating-${movieId}`);
    let rating = ratingInput && ratingInput.value ? parseFloat(ratingInput.value) : null;

    watchlist.push({
        id: movieId,
        title,
        posterPath,
        release_date,
        rating: rating && rating > 0 ? rating : 'N/A'
    });
    displayWatchlist();
}

// Remove movie from watchlist
function removeFromWatchlist(movieId) {
    const idx = watchlist.findIndex(movie => movie.id === movieId);
    if (idx > -1) {
        watchlist.splice(idx, 1);
        displayWatchlist();
    }
}

// Display watchlist
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

        const posterUrl = movie.posterPath
            ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

        item.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title} Poster">
            <h3>${movie.title}</h3>
            <p>Release Date: <b>${movie.release_date || 'Not available'}</b></p>
            <p>Your Rating: <b>${movie.rating}</b> ⭐</p>
            <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
        `;
        watchlistDiv.appendChild(item);
    });
}


function escapeQuotes(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Initial load
displayWatchlist();


// Hamburger toggle
document.getElementById('hamburger').onclick = function() {
  document.getElementById('navLinks').classList.toggle('active');
};

// Simulate page switching (show/hide sections by id)
function showPage(page) {
  // Hide all main sections
  document.querySelectorAll('.app-page').forEach(div => div.style.display = 'none');
  const pageDiv = document.getElementById('page-' + page);
  if (pageDiv) pageDiv.style.display = 'block';

  // Close navbar on mobile
  document.getElementById('navLinks').classList.remove('active');
}

// Genre filtering (using TMDB genres, you may want to map these to actual TMDB genre IDs for real filtering)
function filterGenre(genre) {
  searchMoviesByGenre(genre);
  showPage('home'); // Go to results section
  document.getElementById('navLinks').classList.remove('active');
}

// Example: searchMoviesByGenre implementation (you can expand this mapping)
function searchMoviesByGenre(genreName) {
  const genreMap = {
    'Comedy': 35,
    'Romantic': 10749,
    'Horror': 27,
    'Action': 28,
    'Drama': 18,
    // Add more 
  };
  const genreId = genreMap[genreName];
  if (!genreId) return;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p>Searching for ${genreName} movies...</p>`;
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
    .then(res => res.json())
    .then(data => {
      resultsDiv.innerHTML = '';
      if (data.results && data.results.length > 0) {
        data.results.forEach(movie => {
          const movieDiv = document.createElement('div');
          movieDiv.className = 'movie';
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image';
          movieDiv.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title} Poster">
            <h3>${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : 'N/A'})</h3>
            <p>TMDB Rating: <b>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</b> ⭐</p>
          `;
          resultsDiv.appendChild(movieDiv);
        });
      } else {
        resultsDiv.innerHTML = `<p>No ${genreName} movies found.</p>`;
      }
    });
}